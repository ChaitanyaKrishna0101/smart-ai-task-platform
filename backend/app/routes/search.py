from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..core.deps import get_current_user
from ..schemas.search import SearchRequest, SearchResponse, SearchChunk
from ..services.ai_service import semantic_search, generate_answer
from ..services import activity_service

router = APIRouter(prefix="/search", tags=["search"])


@router.post("/", response_model=SearchResponse)
def search(
    payload: SearchRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    results = semantic_search(payload.query, payload.n_results)
    chunks = [
        SearchChunk(text=text, doc_id=doc_id, distance=dist)
        for text, doc_id, dist in results
    ]
    context_texts = [r[0] for r in results]
    answer = generate_answer(payload.query, context_texts)

    activity_service.log(
        db, current_user.id, "search", payload.query
    )
    return SearchResponse(query=payload.query, answer=answer, chunks=chunks)
