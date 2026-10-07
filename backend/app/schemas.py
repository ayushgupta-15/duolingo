from datetime import date
from pydantic import BaseModel


class UserOut(BaseModel):
    id: int
    username: str
    display_name: str
    avatar_emoji: str
    xp_total: int
    gems: int
    daily_goal_xp: int
    daily_xp_progress: int
    hearts: int
    max_hearts: int
    current_streak: int
    longest_streak: int
    last_activity_date: date | None
    minutes_to_next_heart: int | None

    class Config:
        from_attributes = True


class SkillOut(BaseModel):
    id: int
    title: str
    icon: str
    order_index: int
    total_levels: int
    crowns: int
    status: str


class UnitOut(BaseModel):
    id: int
    title: str
    description: str
    color: str
    order_index: int
    skills: list[SkillOut]


class PathOut(BaseModel):
    course_title: str
    units: list[UnitOut]


class ExerciseOut(BaseModel):
    id: int
    type: str
    prompt: str
    data: dict
    xp_value: int


class LessonOut(BaseModel):
    skill_id: int
    skill_title: str
    level: int
    exercises: list[ExerciseOut]


class AnswerCheckIn(BaseModel):
    answer: object


class AnswerCheckOut(BaseModel):
    correct: bool
    correct_answer: object


class LessonCompleteIn(BaseModel):
    skill_id: int
    correct_count: int
    total_count: int
    hearts_lost: int


class LessonCompleteOut(BaseModel):
    xp_earned: int
    user: UserOut
    skill: SkillOut
    leveled_up: bool


class LeaderboardEntry(BaseModel):
    rank: int
    username: str
    display_name: str
    avatar_emoji: str
    xp_total: int
    is_me: bool
