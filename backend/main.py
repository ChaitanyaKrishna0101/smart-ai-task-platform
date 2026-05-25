import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import init_db

from app.models import user, document, task, activity_log  # noqa
from app.routes import auth, users, documents, tasks, search, analytics

init_db()

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
    allow_origins=["*"],
    allow_credentials=False,
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


from app.core.security import hash_password
from app.core.database import SessionLocal
from app.models.user import User


def seed_admin():
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.email == "admin@futuretransformation.com").first()
        if admin:
            admin.hashed_password = hash_password("Admin@123")
            db.commit()
            print("✅ Admin password reset")
        else:
            db.add(
                User(
                    name="Admin",
                    email="admin@futuretransformation.com",
                    hashed_password=hash_password("Admin@123"),
                    role="admin",
                )
            )
            db.commit()
            print("✅ Default admin created")
    finally:
        db.close()


seed_admin()