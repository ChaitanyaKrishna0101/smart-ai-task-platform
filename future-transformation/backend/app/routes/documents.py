import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from ..core.database import get_db
from ..core.deps import require_admin, get_current_user
from ..core.config import settings
from ..models.document import Document
from ..schemas.document import DocumentOut
from ..services import document_service, activity_service
from ..services.ai_service import index_document, delete_document as ai_delete

router = APIRouter(prefix="/documents", tags=["documents"])


@router.get("/", response_model=List[DocumentOut])
def list_documents(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return db.query(Document).order_by(Document.created_at.desc()).all()


@router.post("/", response_model=DocumentOut, status_code=201)
async def upload_document(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    allowed = {"pdf", "txt"}
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in allowed:
        raise HTTPException(status_code=400, detail="Only PDF and TXT files allowed")

    content = await file.read()
    file_path = document_service.save_upload(settings.UPLOAD_DIR, file.filename, content)

    doc = Document(
        title=title,
        filename=file.filename,
        file_path=file_path,
        file_type=ext,
        description=description,
        uploaded_by=current_user.id,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    try:
        text = document_service.extract_text(file_path, ext)
        chunk_count = index_document(doc.id, text)
        doc.chunk_count = chunk_count
        db.commit()
        db.refresh(doc)
    except Exception as e:
        doc.chunk_count = 0
        db.commit()

    activity_service.log(
        db, current_user.id, "document_upload", f"Uploaded: {file.filename}"
    )
    return doc


@router.delete("/{doc_id}", status_code=204)
def delete_document(
    doc_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    try:
        ai_delete(doc_id)
    except Exception:
        pass
    if os.path.exists(doc.file_path):
        os.remove(doc.file_path)
    db.delete(doc)
    db.commit()
