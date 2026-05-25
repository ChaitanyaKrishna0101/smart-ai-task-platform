import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.core.config import settings
from app.core.database import engine, Base

from app.models import user, document, task, activity_log  # noqa
from app.routes import auth, users, documents, tasks, search, analytics

Base.metadata.create_all(bind=engine)

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


STATIC_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")

if os.path.isdir(STATIC_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(STATIC_DIR, "assets")), name="assets")

    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        index = os.path.join(STATIC_DIR, "index.html")
        return FileResponse(index)


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
