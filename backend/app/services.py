from datetime import datetime, timedelta, date
from sqlalchemy.orm import Session
from app.models.progress import AppState, DailyActivity, UserSkillProgress
from app.models.content import Course, Exercise
from app.models.user import User, HEART_REGEN_MINUTES


def get_day_offset(db: Session) -> int:
    state = db.get(AppState, 1)
    if state is None:
        state = AppState(id=1, day_offset=0)
        db.add(state)
        db.commit()
        db.refresh(state)
    return state.day_offset


def today(db: Session) -> date:
    """Virtual 'today', shifted by an admin-adjustable day offset so streak
    logic can be exercised without waiting on the real calendar."""
    return date.today() + timedelta(days=get_day_offset(db))


def advance_virtual_day(db: Session, days: int = 1) -> date:
    state = db.get(AppState, 1)
    if state is None:
        state = AppState(id=1, day_offset=0)
        db.add(state)
    state.day_offset += days
    db.commit()
    return today(db)


def regen_hearts(db: Session, user: User) -> User:
    if user.hearts >= user.max_hearts:
        user.last_heart_update = datetime.utcnow()
        db.commit()
        return user
    minutes_passed = (datetime.utcnow() - user.last_heart_update).total_seconds() / 60
    hearts_to_add = int(minutes_passed // HEART_REGEN_MINUTES)
    if hearts_to_add > 0:
        user.hearts = min(user.max_hearts, user.hearts + hearts_to_add)
        user.last_heart_update = user.last_heart_update + timedelta(
            minutes=hearts_to_add * HEART_REGEN_MINUTES
        )
        db.commit()
        db.refresh(user)
    return user


def register_xp_and_streak(db: Session, user: User, xp_earned: int) -> User:
    the_day = today(db)
    user.xp_total += xp_earned

    activity = (
        db.query(DailyActivity)
        .filter(DailyActivity.user_id == user.id, DailyActivity.activity_date == the_day)
        .first()
    )
    is_first_activity_today = activity is None
    if activity:
        activity.xp_earned += xp_earned
    else:
        activity = DailyActivity(user_id=user.id, activity_date=the_day, xp_earned=xp_earned)
        db.add(activity)

    if is_first_activity_today:
        if user.last_activity_date == the_day - timedelta(days=1):
            user.current_streak += 1
        elif user.last_activity_date == the_day:
            pass
        else:
            user.current_streak = 1
        user.last_activity_date = the_day
        user.longest_streak = max(user.longest_streak, user.current_streak)

    db.commit()
    db.refresh(user)
    return user


def lose_heart(db: Session, user: User) -> User:
    if user.hearts > 0:
        user.hearts -= 1
        if user.hearts == user.max_hearts - 1:
            user.last_heart_update = datetime.utcnow()
        db.commit()
        db.refresh(user)
    return user


def refill_hearts(db: Session, user: User) -> User:
    user.hearts = user.max_hearts
    user.last_heart_update = datetime.utcnow()
    db.commit()
    db.refresh(user)
    return user


def build_path(db: Session, user: User, course: Course) -> list[dict]:
    """Flatten the course into unit -> skill order and derive each skill's
    lock state + crowns from the user's UserSkillProgress rows."""
    progress_by_skill = {
        p.skill_id: p
        for p in db.query(UserSkillProgress).filter(UserSkillProgress.user_id == user.id)
    }

    units_out = []
    previous_unlocked_and_started = True  # first skill in the course is always available
    for unit in course.units:
        skills_out = []
        for skill in unit.skills:
            prog = progress_by_skill.get(skill.id)
            levels_completed = prog.levels_completed if prog else 0
            crowns = min(levels_completed, skill.total_levels)

            if previous_unlocked_and_started:
                if levels_completed >= skill.total_levels:
                    status = "completed"
                elif levels_completed > 0:
                    status = "in_progress"
                else:
                    status = "available"
            else:
                status = "locked"

            skills_out.append(
                {
                    "id": skill.id,
                    "title": skill.title,
                    "icon": skill.icon,
                    "order_index": skill.order_index,
                    "total_levels": skill.total_levels,
                    "crowns": crowns,
                    "status": status,
                }
            )
            previous_unlocked_and_started = status != "locked" and levels_completed > 0

        units_out.append(
            {
                "id": unit.id,
                "title": unit.title,
                "description": unit.description,
                "color": unit.color,
                "order_index": unit.order_index,
                "skills": skills_out,
            }
        )
    return units_out


def daily_goal_progress(db: Session, user: User) -> int:
    the_day = today(db)
    activity = (
        db.query(DailyActivity)
        .filter(DailyActivity.user_id == user.id, DailyActivity.activity_date == the_day)
        .first()
    )
    return activity.xp_earned if activity else 0


def public_exercise_data(exercise: Exercise) -> dict:
    """Strip the answer key out of an exercise's `data` before it goes to
    the client. Only match_pairs has no hidden field, since the pairing
    itself is the content being displayed."""
    data = exercise.data
    if exercise.type == "multiple_choice":
        return {"question": data["question"], "options": data["options"]}
    if exercise.type == "word_bank":
        return {"sentence": data["sentence"], "tokens": data["tokens"]}
    if exercise.type == "match_pairs":
        return {"pairs": data["pairs"]}
    if exercise.type == "fill_blank":
        return {"sentence": data["sentence"], "options": data["options"]}
    if exercise.type == "type_answer":
        return {"prompt": data["prompt"]}
    raise ValueError(f"Unknown exercise type: {exercise.type}")


def _normalize(text: str) -> str:
    return " ".join(text.strip().lower().split())


def check_answer(exercise: Exercise, answer) -> tuple[bool, object]:
    data = exercise.data
    etype = exercise.type

    if etype == "multiple_choice":
        correct = answer == data["correct_index"]
        return correct, data["options"][data["correct_index"]]

    if etype == "word_bank":
        correct = list(answer or []) == data["correct_order"]
        return correct, " ".join(data["correct_order"])

    if etype == "match_pairs":
        submitted = {item["left"]: item["right"] for item in (answer or [])}
        expected = {p["left"]: p["right"] for p in data["pairs"]}
        correct = submitted == expected
        return correct, data["pairs"]

    if etype == "fill_blank":
        correct = isinstance(answer, str) and _normalize(answer) == _normalize(data["correct_answer"])
        return correct, data["correct_answer"]

    if etype == "type_answer":
        correct = isinstance(answer, str) and _normalize(answer) == _normalize(data["correct_answer"])
        return correct, data["correct_answer"]

    raise ValueError(f"Unknown exercise type: {etype}")


def serialize_user(db: Session, user: User) -> dict:
    regen_hearts(db, user)
    minutes_to_next = None
    if user.hearts < user.max_hearts:
        elapsed = (datetime.utcnow() - user.last_heart_update).total_seconds() / 60
        minutes_to_next = max(0, int(HEART_REGEN_MINUTES - elapsed))
    return {
        "id": user.id,
        "username": user.username,
        "display_name": user.display_name,
        "avatar_emoji": user.avatar_emoji,
        "xp_total": user.xp_total,
        "gems": user.gems,
        "daily_goal_xp": user.daily_goal_xp,
        "daily_xp_progress": daily_goal_progress(db, user),
        "hearts": user.hearts,
        "max_hearts": user.max_hearts,
        "current_streak": user.current_streak,
        "longest_streak": user.longest_streak,
        "last_activity_date": user.last_activity_date,
        "minutes_to_next_heart": minutes_to_next,
    }
