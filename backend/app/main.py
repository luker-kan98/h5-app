import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import app.models
from app.database import Base, engine
from app.api import build, sdk_catalog
from app.services.runtime_schema import (
    ensure_build_task_artifact_columns,
    ensure_host_sample_bigint_columns,
    drop_user_id_columns,
)

Base.metadata.create_all(bind=engine)
ensure_build_task_artifact_columns(engine)
ensure_host_sample_bigint_columns(engine)
drop_user_id_columns(engine)

app = FastAPI(title="H5 App Packager")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(build.router, tags=["build"])
app.include_router(sdk_catalog.router, tags=["sdk"])

BUILDS_DIR = os.getenv("BUILDS_DIR", "./builds")
os.makedirs(BUILDS_DIR, exist_ok=True)
