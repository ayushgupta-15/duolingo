"""Seeds a small Spanish course plus a default learner with some existing
progress, so the app is immediately usable on first run.

Run with: `python -m app.seed.seed_data` (from backend/, inside the venv).
Safe to re-run: it wipes and recreates all tables first.
"""
from datetime import date, timedelta
from app.database import Base, engine, SessionLocal
from app import models
from app.models.user import User
from app.models.content import Course, Unit, Skill, Lesson, Exercise
from app.models.progress import UserSkillProgress, DailyActivity, AppState


def build_exercises(db, lesson: Lesson, specs: list[dict]) -> list[Exercise]:
    out = []
    for i, spec in enumerate(specs):
        ex = Exercise(
            lesson=lesson,
            order_index=i,
            type=spec["type"],
            prompt=spec["prompt"],
            data=spec["data"],
            xp_value=spec.get("xp_value", 10),
        )
        db.add(ex)
        out.append(ex)
    return out


def seed():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # ---- Course / Units / Skills ----
    course = Course(
        slug="es-for-en",
        title="Spanish",
        from_language="English",
        to_language="Spanish",
        flag_emoji="🇪🇸",
    )
    db.add(course)

    unit1 = Unit(course=course, order_index=0, title="Unit 1: Basics", description="Greetings and simple phrases", color="#58CC02")
    unit2 = Unit(course=course, order_index=1, title="Unit 2: Everyday Life", description="Food, family, and daily routines", color="#1CB0F6")
    db.add_all([unit1, unit2])

    s1 = Skill(unit=unit1, order_index=0, title="Greetings", icon="👋", total_levels=2)
    s2 = Skill(unit=unit1, order_index=1, title="Basics 1", icon="🔤", total_levels=3)
    s3 = Skill(unit=unit1, order_index=2, title="Phrases", icon="💬", total_levels=3)
    s4 = Skill(unit=unit2, order_index=0, title="Food", icon="🍎", total_levels=3)
    s5 = Skill(unit=unit2, order_index=1, title="Family", icon="👪", total_levels=3)
    s6 = Skill(unit=unit2, order_index=2, title="Routines", icon="⏰", total_levels=2)
    db.add_all([s1, s2, s3, s4, s5, s6])

    # ---- Greetings: one lesson template, one of each exercise type ----
    l1 = Lesson(skill=s1, order_index=0, title="Greetings 1")
    db.add(l1)
    build_exercises(db, l1, [
        {
            "type": "multiple_choice",
            "prompt": "Which word means 'hello'?",
            "data": {"question": "Which word means 'hello'?", "options": ["Hola", "Adios", "Gracias", "Por favor"], "correct_index": 0},
        },
        {
            "type": "word_bank",
            "prompt": "Translate: 'Good morning'",
            "data": {"sentence": "Good morning", "tokens": ["dias", "Buenos", "noches", "tardes"], "correct_order": ["Buenos", "dias"]},
        },
        {
            "type": "match_pairs",
            "prompt": "Match the pairs",
            "data": {"pairs": [
                {"left": "Hola", "right": "Hello"},
                {"left": "Adios", "right": "Goodbye"},
                {"left": "Gracias", "right": "Thank you"},
            ]},
        },
        {
            "type": "fill_blank",
            "prompt": "Complete the phrase",
            "data": {"sentence": "___, ¿como estas?", "options": ["Hola", "Adios", "Gato"], "correct_answer": "Hola"},
        },
        {
            "type": "type_answer",
            "prompt": "Type 'thank you' in Spanish",
            "data": {"prompt": "Type 'thank you' in Spanish", "correct_answer": "Gracias"},
        },
    ])

    l1b = Lesson(skill=s1, order_index=1, title="Greetings 2")
    db.add(l1b)
    build_exercises(db, l1b, [
        {
            "type": "multiple_choice",
            "prompt": "Which word means 'goodbye'?",
            "data": {"question": "Which word means 'goodbye'?", "options": ["Hola", "Adios", "Buenos dias", "Si"], "correct_index": 1},
        },
        {
            "type": "word_bank",
            "prompt": "Translate: 'Good night'",
            "data": {"sentence": "Good night", "tokens": ["noches", "Buenas", "dias", "tardes"], "correct_order": ["Buenas", "noches"]},
        },
        {
            "type": "type_answer",
            "prompt": "Type 'yes' in Spanish",
            "data": {"prompt": "Type 'yes' in Spanish", "correct_answer": "Si"},
        },
    ])

    # ---- Basics 1 ----
    l2 = Lesson(skill=s2, order_index=0, title="Basics 1")
    db.add(l2)
    build_exercises(db, l2, [
        {
            "type": "multiple_choice",
            "prompt": "'El hombre' means:",
            "data": {"question": "'El hombre' means:", "options": ["The woman", "The man", "The boy", "The girl"], "correct_index": 1},
        },
        {
            "type": "match_pairs",
            "prompt": "Match the pairs",
            "data": {"pairs": [
                {"left": "El agua", "right": "The water"},
                {"left": "La mujer", "right": "The woman"},
                {"left": "El nino", "right": "The boy"},
            ]},
        },
        {
            "type": "fill_blank",
            "prompt": "Complete the sentence",
            "data": {"sentence": "Yo soy ___.", "options": ["un hombre", "una manzana", "el agua"], "correct_answer": "un hombre"},
        },
        {
            "type": "type_answer",
            "prompt": "Type 'the girl' in Spanish",
            "data": {"prompt": "Type 'the girl' in Spanish", "correct_answer": "La nina"},
        },
    ])

    # ---- Phrases ----
    l3 = Lesson(skill=s3, order_index=0, title="Phrases 1")
    db.add(l3)
    build_exercises(db, l3, [
        {
            "type": "word_bank",
            "prompt": "Translate: 'How are you?'",
            "data": {"sentence": "How are you?", "tokens": ["estas", "Como", "bien", "tu"], "correct_order": ["Como", "estas"]},
        },
        {
            "type": "multiple_choice",
            "prompt": "'Por favor' means:",
            "data": {"question": "'Por favor' means:", "options": ["Please", "Sorry", "Excuse me", "You're welcome"], "correct_index": 0},
        },
        {
            "type": "type_answer",
            "prompt": "Type 'I'm sorry' in Spanish",
            "data": {"prompt": "Type \"I'm sorry\" in Spanish", "correct_answer": "Lo siento"},
        },
    ])

    # ---- Food ----
    l4 = Lesson(skill=s4, order_index=0, title="Food 1")
    db.add(l4)
    build_exercises(db, l4, [
        {
            "type": "multiple_choice",
            "prompt": "'La manzana' means:",
            "data": {"question": "'La manzana' means:", "options": ["The bread", "The apple", "The water", "The milk"], "correct_index": 1},
        },
        {
            "type": "match_pairs",
            "prompt": "Match the pairs",
            "data": {"pairs": [
                {"left": "El pan", "right": "Bread"},
                {"left": "La leche", "right": "Milk"},
                {"left": "El agua", "right": "Water"},
            ]},
        },
        {
            "type": "fill_blank",
            "prompt": "Complete the sentence",
            "data": {"sentence": "Yo bebo ___.", "options": ["leche", "manzana", "pan"], "correct_answer": "leche"},
        },
        {
            "type": "type_answer",
            "prompt": "Type 'bread' in Spanish",
            "data": {"prompt": "Type 'bread' in Spanish", "correct_answer": "Pan"},
        },
    ])

    # ---- Family ----
    l5 = Lesson(skill=s5, order_index=0, title="Family 1")
    db.add(l5)
    build_exercises(db, l5, [
        {
            "type": "multiple_choice",
            "prompt": "'La madre' means:",
            "data": {"question": "'La madre' means:", "options": ["Father", "Mother", "Sister", "Brother"], "correct_index": 1},
        },
        {
            "type": "word_bank",
            "prompt": "Translate: 'My father'",
            "data": {"sentence": "My father", "tokens": ["padre", "Mi", "madre", "hermano"], "correct_order": ["Mi", "padre"]},
        },
        {
            "type": "type_answer",
            "prompt": "Type 'sister' in Spanish",
            "data": {"prompt": "Type 'sister' in Spanish", "correct_answer": "Hermana"},
        },
    ])

    # ---- Routines ----
    l6 = Lesson(skill=s6, order_index=0, title="Routines 1")
    db.add(l6)
    build_exercises(db, l6, [
        {
            "type": "multiple_choice",
            "prompt": "'Yo duermo' means:",
            "data": {"question": "'Yo duermo' means:", "options": ["I eat", "I sleep", "I run", "I read"], "correct_index": 1},
        },
        {
            "type": "fill_blank",
            "prompt": "Complete the sentence",
            "data": {"sentence": "Yo ___ a las siete.", "options": ["duermo", "como", "leo"], "correct_answer": "duermo"},
        },
        {
            "type": "type_answer",
            "prompt": "Type 'I eat' in Spanish",
            "data": {"prompt": "Type 'I eat' in Spanish", "correct_answer": "Yo como"},
        },
    ])

    db.commit()

    # ---- Default learner with some pre-existing progress ----
    main_user = User(
        username="ayush",
        display_name="Ayush",
        avatar_emoji="🦉",
        xp_total=40,
        gems=500,
        current_streak=2,
        longest_streak=4,
        last_activity_date=date.today() - timedelta(days=1),
    )
    db.add(main_user)
    db.commit()
    db.refresh(main_user)

    # Mark Greetings as fully completed, Basics 1 as started (1/3 crowns)
    db.add(UserSkillProgress(user_id=main_user.id, skill_id=s1.id, levels_completed=2))
    db.add(UserSkillProgress(user_id=main_user.id, skill_id=s2.id, levels_completed=1))
    db.add(DailyActivity(user_id=main_user.id, activity_date=date.today() - timedelta(days=1), xp_earned=40))

    # A few seeded users so the leaderboard isn't a leaderboard of one
    db.add_all([
        User(username="maria", display_name="Maria", avatar_emoji="🐼", xp_total=120, current_streak=9, longest_streak=9),
        User(username="alex", display_name="Alex", avatar_emoji="🐸", xp_total=85, current_streak=1, longest_streak=5),
        User(username="priya", display_name="Priya", avatar_emoji="🦊", xp_total=60, current_streak=0, longest_streak=3),
    ])

    db.add(AppState(id=1, day_offset=0))
    db.commit()
    db.close()
    print("Seed complete.")


if __name__ == "__main__":
    seed()
