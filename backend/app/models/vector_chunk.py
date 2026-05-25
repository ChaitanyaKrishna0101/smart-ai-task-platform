from sqlalchemy import Column, Integer, String, Text, JSON
from ..core.database import Base

class VectorChunk(Base):
    __tablename__ = "vector_chunks"
    id = Column(String, primary_key=True)
    doc_id = Column(Integer, index=True)
    text = Column(Text)
    embedding = Column(JSON)