from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

engine = None
SessionLocal = None


class Base(DeclarativeBase):
    pass


def init_db():
    global engine, SessionLocal

    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=3600,
    )

    SessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine
    )

    from app.models import user, document, task, activity_log  # noqa
    Base.metadata.create_all(bind=engine)

    print(f"✅ Database initialized")


def get_db():
    if SessionLocal is None:
        raise RuntimeError("Database not initialized. Call init_db() first.")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()