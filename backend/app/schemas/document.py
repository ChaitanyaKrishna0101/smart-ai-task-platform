from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DocumentOut(BaseModel):
    id: int
    title: str
    filename: str
    file_type: Optional[str]
    description: Optional[str]
    chunk_count: int
    uploaded_by: Optional[int]
    created_at: datetime

    model_config = {"from_attributes": True}
