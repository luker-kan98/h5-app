import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models
from app.database import Base, engine
from app.api import auth, build
from app.services.runtime_schema import ensure_build_task_artifact_columns

Base.metadata.create_all(bind=engine)
ensure_build_task_artifact_columns(engine)

app = FastAPI(title="H5 App Packager")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(build.router, tags=["build"])

BUILDS_DIR = os.getenv("BUILDS_DIR", "./builds")
os.makedirs(BUILDS_DIR, exist_ok=True)
# Note: /files is served via an authenticated route in build.py (not StaticFiles)
# This prevents unauthenticated access to build artifacts.
