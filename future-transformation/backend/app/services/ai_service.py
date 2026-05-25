import chromadb
import google.generativeai as genai
from typing import List, Tuple
from ..core.config import settings

# =========================================================
# GEMINI CONFIG
# =========================================================

genai.configure(api_key=settings.GEMINI_API_KEY)

# =========================================================
# CHROMADB
# =========================================================

_chroma = chromadb.PersistentClient(path=settings.CHROMA_DIR)

_collection = _chroma.get_or_create_collection(
    name="documents",
    metadata={"hnsw:space": "cosine"},
)

# =========================================================
# EMBEDDINGS
# =========================================================

def _get_embedding(text: str) -> List[float]:
    try:
        response = genai.embed_content(
            model="models/embedding-001",
            content=text,
            task_type="retrieval_document"
        )

        return response["embedding"]

    except Exception as e:
        print("EMBEDDING ERROR:", str(e))
        raise


# =========================================================
# CHUNKING
# =========================================================

def _chunk_text(text: str) -> List[str]:
    if not text or not text.strip():
        return []

    words = text.split()

    chunk_size = settings.CHUNK_SIZE
    overlap = settings.CHUNK_OVERLAP

    if overlap >= chunk_size:
        overlap = max(1, chunk_size // 4)

    chunks = []
    start = 0

    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end]).strip()

        if len(chunk) > 30:
            chunks.append(chunk)

        start += chunk_size - overlap

    return chunks


# =========================================================
# INDEX DOCUMENT
# =========================================================

def index_document(doc_id: int, text: str) -> int:
    try:
        if not text or not text.strip():
            return 0

        # delete old chunks
        existing = _collection.get(where={"doc_id": doc_id})
        if existing.get("ids"):
            _collection.delete(ids=existing["ids"])

        chunks = _chunk_text(text)

        if not chunks:
            return 0

        embeddings = []
        for chunk in chunks:
            embeddings.append(_get_embedding(chunk))

        ids = [f"doc_{doc_id}_chunk_{i}" for i in range(len(chunks))]
        metadatas = [{"doc_id": doc_id} for _ in chunks]

        _collection.add(
            documents=chunks,
            embeddings=embeddings,
            ids=ids,
            metadatas=metadatas,
        )

        return len(chunks)

    except Exception as e:
        print("INDEX ERROR:", str(e))
        return 0


# =========================================================
# DELETE DOCUMENT
# =========================================================

def delete_document(doc_id: int):
    try:
        existing = _collection.get(where={"doc_id": doc_id})
        if existing.get("ids"):
            _collection.delete(ids=existing["ids"])

    except Exception as e:
        print("DELETE ERROR:", str(e))


# =========================================================
# SEMANTIC SEARCH
# =========================================================

def semantic_search(query: str, n_results: int = 5) -> List[Tuple[str, int, float]]:
    try:
        total = _collection.count()

        if total == 0:
            return []

        query_embedding = _get_embedding(query)

        results = _collection.query(
            query_embeddings=[query_embedding],
            n_results=min(n_results, total),
            include=["documents", "metadatas", "distances"],
        )

        return [
            (
                doc,
                meta.get("doc_id", 0),
                float(dist)
            )
            for doc, meta, dist in zip(
                results["documents"][0],
                results["metadatas"][0],
                results["distances"][0],
            )
        ]

    except Exception as e:
        print("SEARCH ERROR:", str(e))
        return []


# =========================================================
# GENERATE ANSWER (FIXED)
# =========================================================

def generate_answer(query: str, context_chunks: List[str]) -> str:
    try:
        if not context_chunks:
            return "No relevant documents found."

        context = "\n\n---\n\n".join(context_chunks[:5])

        prompt = f"""
You are a strict AI assistant.

Rules:
- Answer ONLY from given context
- If not in context say: "Information not found in documents"

Context:
{context}

Question:
{query}
"""

        model = genai.GenerativeModel("gemini-1.5-flash")

        response = model.generate_content(prompt)

        return response.text.strip()

    except Exception as e:
        print("ANSWER ERROR:", str(e))
        return "Error generating answer"