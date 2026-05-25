from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.core.config import settings

engine = None
SessionLocal = None


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

    # import models so tables are registered
    from app.models import user, document, task, activity_log  # noqa
    Base.metadata.create_all(bind=engine)


class Base(DeclarativeBase):
    pass


# ✅ THIS WAS MISSING (CRITICAL)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()