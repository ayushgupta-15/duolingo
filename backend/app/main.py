import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app import models  # noqa: F401 -- registers models on Base before create_all
from app.routers import path, lessons, user, leaderboard, dev

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Duolingo Clone API")

origins = os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(path.router)
app.include_router(lessons.router)
app.include_router(user.router)
app.include_router(leaderboard.router)
app.include_router(dev.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
