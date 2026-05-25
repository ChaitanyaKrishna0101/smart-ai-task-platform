import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import engine, Base

# Import models so SQLAlchemy registers them
from app.models import user, document, task, activity_log  # noqa

from app.routes import auth, users, documents, tasks, search, analytics

# Create all tables
Base.metadata.create_all(bind=engine)

# Ensure upload dir exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.CHROMA_DIR, exist_ok=True)

app = FastAPI(
    title="Future Transformation — Knowledge Management API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(documents.router)
app.include_router(tasks.router)
app.include_router(search.router)
app.include_router(analytics.router)


@app.get("/health")
def health():
    return {"status": "ok", "app": settings.APP_NAME}


# Seed default admin on first run
from app.core.security import hash_password
from app.core.database import SessionLocal
from app.models.user import User


def seed_admin():
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.role == "admin").first()
        if not admin:
            db.add(
                User(
                    name="Admin",
                    email="admin@futuretransformation.com",
                    hashed_password=hash_password("Admin@123"),
                    role="admin",
                )
            )
            db.commit()
            print("✅ Default admin created: admin@futuretransformation.com / Admin@123")
    finally:
        db.close()


seed_admin()
