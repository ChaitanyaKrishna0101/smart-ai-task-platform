from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..core.database import get_db
from ..core.deps import require_admin
from ..models.task import Task
from ..models.document import Document
from ..models.user import User
from ..models.activity_log import ActivityLog

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/")
def get_analytics(db: Session = Depends(get_db), _=Depends(require_admin)):
    total_tasks = db.query(func.count(Task.id)).scalar()
    completed = db.query(func.count(Task.id)).filter(Task.status == "completed").scalar()
    pending = total_tasks - completed
    total_docs = db.query(func.count(Document.id)).scalar()
    total_users = db.query(func.count(User.id)).filter(User.role == "user").scalar()

    search_logs = (
        db.query(ActivityLog.detail, func.count(ActivityLog.id).label("cnt"))
        .filter(ActivityLog.action == "search")
        .group_by(ActivityLog.detail)
        .order_by(func.count(ActivityLog.id).desc())
        .limit(10)
        .all()
    )
    top_searches = [{"query": row.detail, "count": row.cnt} for row in search_logs]

    recent_activity = (
        db.query(ActivityLog)
        .order_by(ActivityLog.created_at.desc())
        .limit(20)
        .all()
    )
    activity_list = [
        {
            "id": a.id,
            "user_id": a.user_id,
            "action": a.action,
            "detail": a.detail,
            "created_at": a.created_at.isoformat(),
        }
        for a in recent_activity
    ]

    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed,
        "pending_tasks": pending,
        "total_documents": total_docs,
        "total_users": total_users,
        "top_searches": top_searches,
        "recent_activity": activity_list,
    }
