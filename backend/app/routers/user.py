from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.deps import get_current_user
from app.models.user import User
from app.schemas import UserOut
from app import services

router = APIRouter(prefix="/api/user", tags=["user"])


@router.get("/me", response_model=UserOut)
def read_me(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return services.serialize_user(db, user)


@router.post("/hearts/refill", response_model=UserOut)
def refill(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    services.refill_hearts(db, user)
    return services.serialize_user(db, user)
