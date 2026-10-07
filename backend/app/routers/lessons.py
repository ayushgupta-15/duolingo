from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.deps import get_current_user
from app.models.content import Skill, Exercise
from app.models.progress import UserSkillProgress
from app.models.user import User
from app.schemas import LessonOut, AnswerCheckOut, LessonCompleteIn, LessonCompleteOut
from app import services

router = APIRouter(prefix="/api", tags=["lessons"])


def _get_or_create_progress(db: Session, user: User, skill_id: int) -> UserSkillProgress:
    prog = (
        db.query(UserSkillProgress)
        .filter(UserSkillProgress.user_id == user.id, UserSkillProgress.skill_id == skill_id)
        .first()
    )
    if prog is None:
        prog = UserSkillProgress(user_id=user.id, skill_id=skill_id, levels_completed=0)
        db.add(prog)
        db.commit()
        db.refresh(prog)
    return prog


@router.get("/skills/{skill_id}/lesson", response_model=LessonOut)
def get_lesson(skill_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    skill = db.get(Skill, skill_id)
    if skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    if not skill.lessons:
        raise HTTPException(status_code=500, detail="Skill has no lesson templates seeded")

    prog = _get_or_create_progress(db, user, skill_id)
    level = prog.levels_completed
    lesson = skill.lessons[level % len(skill.lessons)]

    return {
        "skill_id": skill.id,
        "skill_title": skill.title,
        "level": level,
        "exercises": [
            {
                "id": ex.id,
                "type": ex.type,
                "prompt": ex.prompt,
                "data": services.public_exercise_data(ex),
                "xp_value": ex.xp_value,
            }
            for ex in lesson.exercises
        ],
    }


@router.post("/exercises/{exercise_id}/check", response_model=AnswerCheckOut)
def check_exercise(
    exercise_id: int,
    body: dict,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    exercise = db.get(Exercise, exercise_id)
    if exercise is None:
        raise HTTPException(status_code=404, detail="Exercise not found")

    correct, correct_answer = services.check_answer(exercise, body.get("answer"))
    if not correct:
        services.lose_heart(db, user)
    return {"correct": correct, "correct_answer": correct_answer}


@router.post("/lessons/complete", response_model=LessonCompleteOut)
def complete_lesson(
    body: LessonCompleteIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    skill = db.get(Skill, body.skill_id)
    if skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")

    prog = _get_or_create_progress(db, user, body.skill_id)
    was_already_mastered = prog.levels_completed >= skill.total_levels

    xp_earned = body.correct_count * 10
    if body.total_count > 0 and body.correct_count == body.total_count:
        xp_earned += 20  # perfect-lesson bonus

    services.register_xp_and_streak(db, user, xp_earned)

    prog.times_practiced += 1
    leveled_up = False
    if not was_already_mastered:
        prog.levels_completed += 1
        leveled_up = True
    db.commit()
    db.refresh(prog)

    crowns = min(prog.levels_completed, skill.total_levels)
    skill_status = (
        "completed" if crowns >= skill.total_levels
        else "in_progress" if crowns > 0
        else "available"
    )

    return {
        "xp_earned": xp_earned,
        "user": services.serialize_user(db, user),
        "skill": {
            "id": skill.id,
            "title": skill.title,
            "icon": skill.icon,
            "order_index": skill.order_index,
            "total_levels": skill.total_levels,
            "crowns": crowns,
            "status": skill_status,
        },
        "leveled_up": leveled_up,
    }
