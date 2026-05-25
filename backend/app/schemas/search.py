from pydantic import BaseModel
from typing import List, Optional


class SearchRequest(BaseModel):
    query: str
    n_results: int = 5


class SearchChunk(BaseModel):
    text: str
    doc_id: Optional[int]
    distance: Optional[float]


class SearchResponse(BaseModel):
    query: str
    answer: str
    chunks: List[SearchChunk]
