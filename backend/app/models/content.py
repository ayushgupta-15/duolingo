from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True)
    title = Column(String, nullable=False)
    from_language = Column(String, nullable=False)
    to_language = Column(String, nullable=False)
    flag_emoji = Column(String, default="🌐")

    units = relationship(
        "Unit", back_populates="course", order_by="Unit.order_index",
        cascade="all, delete-orphan",
    )


class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    order_index = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, default="")
    color = Column(String, default="#58CC02")

    course = relationship("Course", back_populates="units")
    skills = relationship(
        "Skill", back_populates="unit", order_by="Skill.order_index",
        cascade="all, delete-orphan",
    )


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    order_index = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    icon = Column(String, default="⭐")
    total_levels = Column(Integer, default=3)

    unit = relationship("Unit", back_populates="skills")
    lessons = relationship(
        "Lesson", back_populates="skill", order_by="Lesson.order_index",
        cascade="all, delete-orphan",
    )


class Lesson(Base):
    """A lesson template for a skill. Levels beyond the number of templates
    cycle back through them for extra-practice replays."""

    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    order_index = Column(Integer, nullable=False)
    title = Column(String, default="")

    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship(
        "Exercise", back_populates="lesson", order_by="Exercise.order_index",
        cascade="all, delete-orphan",
    )


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    order_index = Column(Integer, nullable=False)
    type = Column(String, nullable=False)
    # type in: multiple_choice, word_bank, match_pairs, fill_blank, type_answer
    prompt = Column(String, nullable=False)
    data = Column(JSON, nullable=False)
    # data holds type-specific fields, INCLUDING the correct answer.
    # The answer-check endpoint never returns `data` as-is to the client.
    xp_value = Column(Integer, default=10)

    lesson = relationship("Lesson", back_populates="exercises")
