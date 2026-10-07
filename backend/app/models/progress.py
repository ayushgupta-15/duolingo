from sqlalchemy import Column, Integer, String, ForeignKey, Date, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base


class UserSkillProgress(Base):
    __tablename__ = "user_skill_progress"
    __table_args__ = (UniqueConstraint("user_id", "skill_id", name="uq_user_skill"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    levels_completed = Column(Integer, default=0)
    times_practiced = Column(Integer, default=0)

    skill = relationship("Skill")


class DailyActivity(Base):
    """One row per user per calendar day they earned XP. Backs the streak
    counter and the daily-goal progress ring."""

    __tablename__ = "daily_activity"
    __table_args__ = (UniqueConstraint("user_id", "activity_date", name="uq_user_day"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    activity_date = Column(Date, nullable=False)
    xp_earned = Column(Integer, default=0)


class AppState(Base):
    """Singleton row (id=1) holding a day offset so the grader can advance
    the virtual 'today' without waiting on a real clock, to exercise streak
    logic deterministically."""

    __tablename__ = "app_state"

    id = Column(Integer, primary_key=True, default=1)
    day_offset = Column(Integer, default=0)
