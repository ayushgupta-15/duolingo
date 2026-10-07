# Lingo — A Duolingo Clone

A full-stack clone of the Duolingo learning-path experience, built for the Scaler AI Labs
SDE Fullstack take-home assignment. Learners move through a skill tree, complete lessons
made of five exercise types, earn XP, maintain a streak, and lose/regain hearts — all
backed by a real database with persisted per-user progress.

## Tech Stack

- **Frontend:** Next.js 16 (App Router, TypeScript), Tailwind CSS v4
- **Backend:** Python, FastAPI, SQLAlchemy ORM
- **Database:** SQLite (file-based, `backend/duolingo.db`)

## Project Structure

```
duolingo-clone/
├── frontend/           Next.js app (App Router)
│   ├── app/             routes: "/", "/lesson/[skillId]", "/profile", "/leaderboard", "/settings"
│   ├── components/      SkillNode, exercise players, modals, feedback bar, nav
│   └── lib/              api.ts (typed fetch client), UserContext.tsx
└── backend/            FastAPI app
    ├── app/models/       SQLAlchemy models (user, content, progress)
    ├── app/routers/      path, lessons, user, leaderboard, dev
    ├── app/services.py   streak/XP/hearts/path business logic
    └── app/seed/         seed_data.py — populates the DB with a course + a default learner
```

## Setup

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m app.seed.seed_data    # creates duolingo.db and seeds course + learner
uvicorn app.main:app --reload --port 8000
```

API now runs at `http://localhost:8000` (interactive docs at `/docs`).

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL if the backend isn't on :8000
npm run dev
```

App runs at `http://localhost:3000`.

## Architecture Overview

- **No real auth**, per the assignment's "Mocked / Placeholder" allowance — every request acts
  as a single seeded learner (`username=ayush`), resolved server-side in `app/deps.py`.
- **Course content** (course → unit → skill → lesson → exercise) is fully relational and
  database-backed, seeded once via `seed_data.py`. A skill has several lesson "level" templates;
  once a learner exhausts them, levels cycle back through the templates for extra practice.
- **Progress** is tracked per user per skill (`UserSkillProgress.levels_completed`), which drives
  both the crown count and the lock/unlock state of the whole path: a skill unlocks once the
  immediately preceding skill (in course order) has at least one level completed. This flattening
  logic lives in `services.build_path`.
- **Hearts** regenerate lazily: no background job — `regen_hearts` computes elapsed time against
  `last_heart_update` on every read and credits hearts accordingly (1 every 30 minutes, capped at
  `max_hearts`). A "refill" endpoint mocks an instant refill (gems cost is not actually deducted,
  per the assignment's note that gems can be mocked).
- **Streaks** are computed from a `DailyActivity` table (one row per user per day with XP earned
  that day), not from wall-clock heuristics on `User` alone — this keeps the daily-goal ring and
  the streak counter backed by the same source of truth. Because the real calendar can't be
  fast-forwarded during grading, `POST /api/dev/advance-day` shifts a virtual "today" (stored in
  `AppState`) so streak continuation/breakage can be exercised on demand — see Assumptions below.
- **Exercise answer keys never reach the client.** `services.public_exercise_data` strips the
  correct answer/index out of each exercise's `data` blob before it's sent for display;
  `services.check_answer` holds the only code path that compares a submitted answer against the
  stored key, server-side.

## Database Schema

```
courses(id, slug, title, from_language, to_language, flag_emoji)
  └─< units(id, course_id, order_index, title, description, color)
        └─< skills(id, unit_id, order_index, title, icon, total_levels)
              └─< lessons(id, skill_id, order_index, title)
                    └─< exercises(id, lesson_id, order_index, type, prompt, data JSON, xp_value)

users(id, username, display_name, avatar_emoji, xp_total, gems, daily_goal_xp,
      hearts, max_hearts, last_heart_update,
      current_streak, longest_streak, last_activity_date)

user_skill_progress(id, user_id FK, skill_id FK, levels_completed, times_practiced)
  UNIQUE(user_id, skill_id)

daily_activity(id, user_id FK, activity_date, xp_earned)
  UNIQUE(user_id, activity_date)

app_state(id=1, day_offset)   -- singleton; backs the virtual-clock dev endpoint
```

`exercises.data` is a JSON column whose shape depends on `type`:

| type              | stored fields                                         |
|-------------------|--------------------------------------------------------|
| `multiple_choice` | `question`, `options[]`, `correct_index`               |
| `word_bank`       | `sentence`, `tokens[]` (shuffled bank), `correct_order[]` |
| `match_pairs`     | `pairs[]` of `{left, right}` (no hidden field — the pairing itself is the content) |
| `fill_blank`      | `sentence` (with `___`), `options[]`, `correct_answer`  |
| `type_answer`     | `prompt`, `correct_answer`                              |

## API Overview

| Method | Path                              | Purpose                                             |
|--------|------------------------------------|------------------------------------------------------|
| GET    | `/api/user/me`                    | Current learner's stats (XP, hearts, streak, gems)    |
| POST   | `/api/user/hearts/refill`         | Mock-refill hearts to max                             |
| GET    | `/api/path`                       | Full skill tree with per-skill lock state and crowns  |
| GET    | `/api/skills/{id}/lesson`         | Next lesson's exercises for a skill (answers stripped)|
| POST   | `/api/exercises/{id}/check`       | Check a submitted answer; deducts a heart if wrong    |
| POST   | `/api/lessons/complete`           | Award XP, advance streak, increment skill's crowns    |
| GET    | `/api/leaderboard`                | Users ranked by total XP                              |
| POST   | `/api/dev/advance-day?days=1`     | Shift the virtual "today" (streak testing helper)     |

## Deployment Notes

- Backend (Render free web service): root directory `backend`, build command
  `pip install -r requirements.txt`, start command
  `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Set the `CORS_ORIGINS` env
  var to the deployed frontend's origin.
- Frontend (Vercel): root directory `frontend`, set `NEXT_PUBLIC_API_URL` to the
  deployed backend's URL.
- **Known limitation:** Render's free tier has an ephemeral filesystem — the
  SQLite file is wiped on every redeploy or on spin-down after 15 minutes of
  inactivity. `app/main.py` detects a missing database file on boot and
  re-seeds automatically, so the app never serves a broken/empty state, but
  progress made during one "session" (until the instance idles out) won't
  survive a cold start on the free tier. A paid instance with a persistent
  disk (or swapping SQLite for Render Postgres) would fix this; out of scope
  for this assignment's instance tier.

## Assumptions

- Real auth, payments/gems economy, friends/social, and multiple languages are out of scope per
  the brief and are either hardcoded to one learner or mocked (gems displayed but never actually
  spent on refills).
- "Day logic can be simulated/testable" is implemented via an explicit admin endpoint
  (`POST /api/dev/advance-day`) rather than letting the server clock be mocked implicitly — this
  keeps the simulation hook visible and auditable in the API surface rather than hidden
  behind a special header or query param on every request.
- Audio, achievements/badges, a cross-user functioning leaderboard, legendary mode, and dark mode
  are the listed bonus items; a seeded (not fully "real-time") leaderboard and a static
  achievements grid on the profile page are implemented, the rest are left out given the
  timeline.
