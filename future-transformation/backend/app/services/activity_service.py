from sqlalchemy.orm import Session
from ..models.activity_log import ActivityLog
from typing import Optional


def log(db: Session, user_id: Optional[int], action: str, detail: Optional[str] = None):
    entry = ActivityLog(user_id=user_id, action=action, detail=detail)
    db.add(entry)
    db.commit()
