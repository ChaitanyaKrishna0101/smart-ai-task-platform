import math
from groq import Groq
from sentence_transformers import SentenceTransformer
from typing import List, Tuple
from ..core.config import settings


# =========================================================
# GROQ CLIENT (replaces Gemini)
# =========================================================

_client = None

def _get_client():
    global _client
    if _client is None:
        if not settings.GROQ_API_KEY:
            raise ValueError("GROQ_API_KEY is not configured.")
        _client = Groq(api_key=settings.GROQ_API_KEY)
    return _client


# =========================================================
# SENTENCE TRANSFORMER (replaces Gemini embeddings)
# =========================================================

_embedding_model = None

def _get_embedding_model():
    global _embedding_model
    if _embedding_model is None:
        _embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
    return _embedding_model


# =========================================================
# POSTGRESQL-BACKED VECTOR STORE (unchanged)
# =========================================================

class _VectorStore:

    @staticmethod
    def _cosine_distance(a: List[float], b: List[float]) -> float:
        dot = sum(x * y for x, y in zip(a, b))
        mag_a = math.sqrt(sum(x * x for x in a))
        mag_b = math.sqrt(sum(x * x for x in b))
        if mag_a == 0 or mag_b == 0:
            return 1.0
        return 1.0 - dot / (mag_a * mag_b)

    def count(self) -> int:
        from ..core.database import SessionLocal
        from ..models.vector_chunk import VectorChunk
        db = SessionLocal()
        try:
            return db.query(VectorChunk).count()
        finally:
            db.close()

    def get_ids_for_doc(self, doc_id: int) -> List[str]:
        from ..core.database import SessionLocal
        from ..models.vector_chunk import VectorChunk
        db = SessionLocal()
        try:
            rows = db.query(VectorChunk).filter(VectorChunk.doc_id == doc_id).all()
            return [r.id for r in rows]
        finally:
            db.close()

    def delete(self, ids: List[str]):
        from ..core.database import SessionLocal
        from ..models.vector_chunk import VectorChunk
        db = SessionLocal()
        try:
            db.query(VectorChunk).filter(VectorChunk.id.in_(ids)).delete(synchronize_session=False)
            db.commit()
        finally:
            db.close()

    def add(self, ids: List[str], documents: List[str],
            embeddings: List[List[float]], doc_ids: List[int]):
        from ..core.database import SessionLocal
        from ..models.vector_chunk import VectorChunk
        db = SessionLocal()
        try:
            for chunk_id, text, embedding, doc_id in zip(ids, documents, embeddings, doc_ids):
                db.add(VectorChunk(
                    id=chunk_id,
                    doc_id=doc_id,
                    text=text,
                    embedding=embedding
                ))
            db.commit()
        finally:
            db.close()

    def query(self, query_embedding: List[float],
              n_results: int) -> List[Tuple[str, int, float]]:
        from ..core.database import SessionLocal
        from ..models.vector_chunk import VectorChunk
        db = SessionLocal()
        try:
            chunks = db.query(VectorChunk).all()
            if not chunks:
                return []
            scored = [
                (c.text, c.doc_id, self._cosine_distance(query_embedding, c.embedding))
                for c in chunks
            ]
            scored.sort(key=lambda x: x[2])
            return scored[:n_results]
        finally:
            db.close()


_store = _VectorStore()


# =========================================================
# EMBEDDINGS (sentence-transformers replaces Gemini)
# =========================================================

def _get_embedding(text: str) -> List[float]:
    try:
        model = _get_embedding_model()
        embedding = model.encode(text, convert_to_numpy=True)
        return embedding.tolist()
    except Exception as e:
        print("EMBEDDING ERROR:", str(e))
        raise


# =========================================================
# TEXT CHUNKING (unchanged)
# =========================================================

def _chunk_text(text: str) -> List[str]:
    if not text or not text.strip():
        return []
    words = text.split()
    if not words:
        return []
    chunk_size = settings.CHUNK_SIZE
    overlap = settings.CHUNK_OVERLAP
    if overlap >= chunk_size:
        overlap = max(1, chunk_size // 4)
    chunks, start = [], 0
    while start < len(words):
        chunk = " ".join(words[start: start + chunk_size]).strip()
        if len(chunk) > 30:
            chunks.append(chunk)
        start += chunk_size - overlap
    return chunks


# =========================================================
# INDEX DOCUMENT (unchanged)
# =========================================================

def index_document(doc_id: int, text: str) -> int:
    try:
        print("\n" + "=" * 60)
        print("INDEXING DOCUMENT — DOC ID:", doc_id)
        if not text:
            print("ERROR: EMPTY TEXT")
            return 0
        print("TEXT LENGTH:", len(text))

        existing_ids = _store.get_ids_for_doc(doc_id)
        if existing_ids:
            print("DELETING OLD CHUNKS:", len(existing_ids))
            _store.delete(existing_ids)

        chunks = _chunk_text(text)
        print("TOTAL CHUNKS:", len(chunks))
        if not chunks:
            return 0

        print("CREATING EMBEDDINGS...")
        embeddings = []
        for i, chunk in enumerate(chunks):
            print(f"  Embedding chunk {i + 1}/{len(chunks)}")
            embeddings.append(_get_embedding(chunk))

        ids = [f"doc_{doc_id}_chunk_{i}" for i in range(len(chunks))]
        doc_ids = [doc_id] * len(chunks)
        _store.add(ids=ids, documents=chunks, embeddings=embeddings, doc_ids=doc_ids)
        print("INDEX SUCCESS — chunks saved:", len(chunks))
        print("=" * 60)
        return len(chunks)

    except Exception as e:
        print("INDEXING FAILED:", str(e))
        print("=" * 60)
        return 0


# =========================================================
# DELETE DOCUMENT (unchanged)
# =========================================================

def delete_document(doc_id: int):
    try:
        ids = _store.get_ids_for_doc(doc_id)
        if ids:
            _store.delete(ids)
            print(f"Deleted {len(ids)} chunks for doc {doc_id}")
    except Exception as e:
        print("DELETE ERROR:", str(e))


# =========================================================
# SEMANTIC SEARCH (unchanged)
# =========================================================

def semantic_search(query: str, n_results: int = 5) -> List[Tuple[str, int, float]]:
    try:
        total = _store.count()
        print("\nSEMANTIC SEARCH — total chunks in store:", total)
        if total == 0:
            return []
        query_embedding = _get_embedding(query)
        results = _store.query(query_embedding, min(n_results, total))
        print("RESULTS FOUND:", len(results))
        return results
    except Exception as e:
        print("SEARCH ERROR:", str(e))
        return []


# =========================================================
# GENERATE ANSWER (Groq replaces Gemini)
# =========================================================

def generate_answer(query: str, context_chunks: List[str]) -> str:
    try:
        if not context_chunks:
            return "No relevant documents found. Please upload and index documents first."

        context = "\n\n---\n\n".join(context_chunks[:5])
        prompt = f"""You are a helpful AI assistant for Future Transformation company.

Your task:
- Answer ONLY using the provided document context.
- Do NOT make up information.
- Keep answers concise and accurate.

If the answer is not found in the documents, say:
"I could not find that information in the uploaded documents."

DOCUMENT CONTEXT:
{context}

USER QUESTION:
{query}

ANSWER:"""

        print("\nGENERATING ANSWER...")
        response = _get_client().chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful AI assistant for Future Transformation company. Answer only from the provided document context. Do not make up information."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2,
            max_tokens=1024,
        )
        print("ANSWER GENERATED")
        return response.choices[0].message.content.strip()

    except Exception as e:
        print("ANSWER GENERATION ERROR:", str(e))
        return "Error generating answer from AI model."
