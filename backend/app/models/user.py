from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Date, DateTime
from app.database import Base

DEFAULT_MAX_HEARTS = 5
HEART_REGEN_MINUTES = 30
DAILY_XP_GOAL = 50


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    display_name = Column(String, nullable=False)
    avatar_emoji = Column(String, default="🦉")
    created_at = Column(DateTime, default=datetime.utcnow)

    xp_total = Column(Integer, default=0)
    gems = Column(Integer, default=500)
    daily_goal_xp = Column(Integer, default=DAILY_XP_GOAL)

    hearts = Column(Integer, default=DEFAULT_MAX_HEARTS)
    max_hearts = Column(Integer, default=DEFAULT_MAX_HEARTS)
    last_heart_update = Column(DateTime, default=datetime.utcnow)

    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_activity_date = Column(Date, nullable=True)
