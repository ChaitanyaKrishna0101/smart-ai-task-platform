from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Future Transformation"
    SECRET_KEY: str = "change-me-to-a-long-random-secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    DATABASE_URL: str = "mysql+pymysql://root:password@localhost/ft_knowledge"

    GEMINI_API_KEY: str = ""

    UPLOAD_DIR: str = "uploads"
    CHROMA_DIR: str = "chroma_db"

    CHUNK_SIZE: int = 150
    CHUNK_OVERLAP: int = 30

    class Config:
        env_file = ".env"


settings = Settings()
