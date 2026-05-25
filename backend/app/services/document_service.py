import os
import io
from typing import Optional

try:
    from PyPDF2 import PdfReader
    _HAS_PYPDF2 = True
except ImportError:
    _HAS_PYPDF2 = False

try:
    from pdfminer.high_level import extract_text as pdfminer_extract
    _HAS_PDFMINER = True
except ImportError:
    _HAS_PDFMINER = False


def extract_text(file_path: str, file_type: str) -> str:
    ext = file_type.lower().strip(".")
    if ext == "txt":
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()

    if ext == "pdf":
        text = ""
        if _HAS_PDFMINER:
            try:
                text = pdfminer_extract(file_path)
            except Exception:
                pass
        if not text and _HAS_PYPDF2:
            try:
                reader = PdfReader(file_path)
                text = "\n".join(
                    page.extract_text() or "" for page in reader.pages
                )
            except Exception:
                pass
        return text.strip()

    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()


def save_upload(upload_dir: str, filename: str, content: bytes) -> str:
    os.makedirs(upload_dir, exist_ok=True)
    safe = "".join(c for c in filename if c.isalnum() or c in "._- ")
    path = os.path.join(upload_dir, safe)
    with open(path, "wb") as f:
        f.write(content)
    return path
