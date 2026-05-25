from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum("admin", "user"), default="user", nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    tasks_assigned = relationship(
        "Task", foreign_keys="Task.assigned_to", back_populates="assignee"
    )
    tasks_created = relationship(
        "Task", foreign_keys="Task.created_by", back_populates="creator"
    )
    activity_logs = relationship("ActivityLog", back_populates="user")
