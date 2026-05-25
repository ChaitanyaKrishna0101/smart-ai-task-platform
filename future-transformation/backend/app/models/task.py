from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    difficulty = Column(Enum("easy", "medium", "hard"), default="medium")
    status = Column(Enum("pending", "completed"), default="pending")
    submission = Column(Text, nullable=True)
    submitted_at = Column(DateTime, nullable=True)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"))
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    assignee = relationship(
        "User", foreign_keys=[assigned_to], back_populates="tasks_assigned"
    )
    creator = relationship(
        "User", foreign_keys=[created_by], back_populates="tasks_created"
    )
    document = relationship("Document", back_populates="tasks")
