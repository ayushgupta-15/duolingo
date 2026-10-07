from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.deps import get_current_user
from app.models.content import Course
from app.models.user import User
from app.schemas import PathOut
from app import services

router = APIRouter(prefix="/api/path", tags=["path"])


@router.get("", response_model=PathOut)
def get_path(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    course = db.query(Course).first()
    if course is None:
        raise HTTPException(status_code=500, detail="No course seeded.")
    units = services.build_path(db, user, course)
    return {"course_title": course.title, "units": units}
