from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    difficulty: str = "medium"
    assigned_to: Optional[int] = None
    document_id: Optional[int] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[str] = None
    assigned_to: Optional[int] = None
    document_id: Optional[int] = None


class TaskSubmit(BaseModel):
    submission: str


class TaskOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    difficulty: str
    status: str
    submission: Optional[str]
    submitted_at: Optional[datetime]
    assigned_to: Optional[int]
    created_by: int
    document_id: Optional[int]
    created_at: datetime

    model_config = {"from_attributes": True}


class TaskOutFull(TaskOut):
    assignee_name: Optional[str] = None
    document_title: Optional[str] = None
