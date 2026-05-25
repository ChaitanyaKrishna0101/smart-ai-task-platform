import os
from pydantic_settings import BaseSettings


def _get_db_url() -> str:
    url = os.environ.get("DATABASE_URL", "")
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    return url or "postgresql://localhost/ft_knowledge"


class Settings(BaseSettings):
    APP_NAME: str = "Future Transformation"
    SECRET_KEY: str = "change-me-to-a-long-random-secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    DATABASE_URL: str = _get_db_url()

    GEMINI_API_KEY: str = ""

    UPLOAD_DIR: str = "uploads"
    CHROMA_DIR: str = "chroma_db"

    CHUNK_SIZE: int = 150
    CHUNK_OVERLAP: int = 30

    class Config:
        env_file = ".env"


settings = Settings()
