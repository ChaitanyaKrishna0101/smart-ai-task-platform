from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from ..core.database import get_db
from ..core.deps import require_admin, get_current_user
from ..models.task import Task
from ..models.user import User
from ..models.document import Document
from ..schemas.task import TaskCreate, TaskUpdate, TaskSubmit, TaskOut, TaskOutFull
from ..services import activity_service

router = APIRouter(prefix="/tasks", tags=["tasks"])


def _enrich(task: Task) -> dict:
    d = {c.name: getattr(task, c.name) for c in task.__table__.columns}
    d["assignee_name"] = task.assignee.name if task.assignee else None
    d["document_title"] = task.document.title if task.document else None
    return d


@router.get("/", response_model=List[TaskOutFull])
def list_tasks(
    status: Optional[str] = Query(None),
    assigned_to: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    q = db.query(Task)
    if current_user.role == "user":
        q = q.filter(Task.assigned_to == current_user.id)
    else:
        if assigned_to:
            q = q.filter(Task.assigned_to == assigned_to)
    if status:
        q = q.filter(Task.status == status)
    tasks = q.order_by(Task.created_at.desc()).all()
    return [_enrich(t) for t in tasks]


@router.post("/", response_model=TaskOut, status_code=201)
def create_task(
    payload: TaskCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    task = Task(
        title=payload.title,
        description=payload.description,
        difficulty=payload.difficulty,
        assigned_to=payload.assigned_to,
        document_id=payload.document_id,
        created_by=current_user.id,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.patch("/{task_id}", response_model=TaskOutFull)
def update_task(
    task_id: int,
    payload: TaskUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    for field, val in payload.model_dump(exclude_unset=True).items():
        setattr(task, field, val)
    db.commit()
    db.refresh(task)
    return _enrich(task)


@router.post("/{task_id}/submit", response_model=TaskOutFull)
def submit_task(
    task_id: int,
    payload: TaskSubmit,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if current_user.role == "user" and task.assigned_to != current_user.id:
        raise HTTPException(status_code=403, detail="Not your task")
    task.submission = payload.submission
    task.status = "completed"
    task.submitted_at = datetime.utcnow()
    db.commit()
    db.refresh(task)
    activity_service.log(
        db, current_user.id, "task_update", f"Completed task #{task_id}: {task.title}"
    )
    return _enrich(task)


@router.delete("/{task_id}", status_code=204)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
