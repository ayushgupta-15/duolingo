from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.deps import get_current_user
from app.models.user import User
from app.schemas import LeaderboardEntry

router = APIRouter(prefix="/api/leaderboard", tags=["leaderboard"])


@router.get("", response_model=list[LeaderboardEntry])
def get_leaderboard(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    users = db.query(User).order_by(User.xp_total.desc()).all()
    return [
        {
            "rank": i + 1,
            "username": u.username,
            "display_name": u.display_name,
            "avatar_emoji": u.avatar_emoji,
            "xp_total": u.xp_total,
            "is_me": u.id == user.id,
        }
        for i, u in enumerate(users)
    ]
