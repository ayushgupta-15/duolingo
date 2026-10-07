from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User

DEFAULT_USERNAME = "ayush"


def get_current_user(db: Session = Depends(get_db)) -> User:
    """Real auth is out of scope per the assignment brief; every request
    acts as this single seeded learner."""
    user = db.query(User).filter(User.username == DEFAULT_USERNAME).first()
    if user is None:
        raise HTTPException(status_code=500, detail="Default user not seeded. Run the seed script.")
    return user
