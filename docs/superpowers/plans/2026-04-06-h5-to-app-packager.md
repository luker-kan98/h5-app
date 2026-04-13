# H5 转多平台 App 打包平台 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a monorepo platform where users submit an H5 URL and receive downloadable Android/iOS/macOS/Windows native app packages.

**Architecture:** FastAPI backend with Celery async task queue processes packaging requests; each build task copies Capacitor/Electron wrapper templates to an isolated temp directory, injects the H5 URL, runs platform build tools, and stores artifacts locally. Vue 3 frontend polls task status and presents download links.

**Tech Stack:** Vue 3 + Vite + TypeScript + Pinia + TailwindCSS | FastAPI + SQLAlchemy + SQLite | Celery + Redis | JWT auth | Capacitor (Android/iOS) | Electron (macOS/Windows) | Docker Compose

**Spec:** `docs/superpowers/specs/2026-04-05-h5-to-app-packager-design.md`

---

## File Map

### Backend (`backend/`)
| File | Responsibility |
|------|---------------|
| `app/main.py` | FastAPI app factory, CORS, static file mount, router registration |
| `app/database.py` | SQLAlchemy engine, session factory, Base |
| `app/models/user.py` | User ORM model |
| `app/models/build_job.py` | BuildJob ORM model |
| `app/schemas.py` | Pydantic request/response schemas |
| `app/api/auth.py` | `/auth/register`, `/auth/login` routes |
| `app/api/build.py` | `/build`, `/build/{task_id}`, `/builds/history` routes |
| `app/services/auth_service.py` | JWT create/verify, password hash/verify |
| `app/services/url_validator.py` | H5 URL validation + SSRF protection |
| `app/services/file_service.py` | Build artifact paths, download URL generation |
| `app/tasks/build_task.py` | Celery task: copy wrapper, build per platform, store artifacts |
| `app/dependencies.py` | FastAPI dependency: `get_db`, `get_current_user` |
| `celeryconfig.py` | Celery broker/backend config, task timeouts |
| `requirements.txt` | All Python dependencies pinned |
| `tests/test_auth.py` | Auth endpoint tests |
| `tests/test_build.py` | Build endpoint tests |
| `tests/test_url_validator.py` | URL validation unit tests |
| `tests/conftest.py` | pytest fixtures: test client, test DB, test user |

### Frontend (`frontend/`)
| File | Responsibility |
|------|---------------|
| `src/main.ts` | App entry, Pinia + Router setup |
| `src/router/index.ts` | Route definitions, navigation guard |
| `src/stores/auth.ts` | Pinia store: JWT token, user state, login/logout |
| `src/composables/useAuth.ts` | Login/register API calls |
| `src/composables/useBuild.ts` | Submit build, poll task status |
| `src/api/client.ts` | Axios instance with JWT interceptor |
| `src/views/LoginView.vue` | Login + register tabs |
| `src/views/HomeView.vue` | URL input + platform checkboxes + submit |
| `src/views/TaskView.vue` | Poll status, per-platform status cards, download buttons |
| `src/views/HistoryView.vue` | Paginated history list |
| `src/components/PlatformCard.vue` | Single platform status card (reused in TaskView) |

### Wrappers
| File | Responsibility |
|------|---------------|
| `capacitor-wrapper/capacitor.config.ts` | Capacitor config — `server.url` injected per build |
| `capacitor-wrapper/src/index.html` | Minimal shell page |
| `capacitor-wrapper/package.json` | Capacitor deps |
| `electron-wrapper/main.js` | Electron main process — reads `process.env.H5_URL` |
| `electron-wrapper/preload.js` | Minimal preload |
| `electron-wrapper/package.json` | Electron + electron-builder deps |

### Root
| File | Responsibility |
|------|---------------|
| `docker-compose.yml` | 4 services: redis, backend, celery-worker, frontend |
| `.gitignore` | Ignore `builds/`, `*.pyc`, `node_modules/`, `.env` |
| `builds/.gitkeep` | Keep builds dir in git (contents ignored) |

---

## Task 1: Monorepo Scaffolding

**Files:**
- Create: `.gitignore`
- Create: `builds/.gitkeep`
- Create: `backend/requirements.txt`
- Create: `backend/tests/conftest.py`

- [ ] **Step 1: Initialize git repo and root structure**

```bash
cd /Users/hhy/project/h5-app
git init
mkdir -p backend/app/{api,models,services,tasks} backend/tests frontend capacitor-wrapper/src electron-wrapper builds
touch builds/.gitkeep
```

- [ ] **Step 2: Create `.gitignore`**

```
# Python
__pycache__/
*.pyc
*.pyo
.venv/
*.egg-info/

# Node
node_modules/
dist/
.cache/

# Build artifacts
builds/*
!builds/.gitkeep
/tmp/build-*/

# DB
*.db
*.sqlite3

# Env
.env
.env.local

# Capacitor / Android / iOS (generated, but we commit the native dirs)
capacitor-wrapper/.cache/

# Electron build output
electron-wrapper/dist/
electron-wrapper/out/
```

- [ ] **Step 3: Create `backend/requirements.txt`**

```
fastapi==0.115.0
uvicorn[standard]==0.30.6
sqlalchemy==2.0.35
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.12
celery[redis]==5.4.0
redis==5.1.1
httpx==0.27.2
pytest==8.3.3
pytest-asyncio==0.24.0
anyio==4.6.0
```

- [ ] **Step 4: Create `backend/tests/conftest.py`**

```python
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
from app.main import app
from app.dependencies import get_db

TEST_DB_URL = "sqlite:///:memory:"
engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def registered_user(client):
    client.post("/auth/register", json={"username": "testuser", "password": "testpass123"})
    return {"username": "testuser", "password": "testpass123"}


@pytest.fixture
def auth_headers(client, registered_user):
    resp = client.post("/auth/login", json=registered_user)
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
```

- [ ] **Step 5: Commit**

```bash
git add .gitignore builds/.gitkeep backend/requirements.txt backend/tests/conftest.py
git commit -m "chore: monorepo scaffolding and test fixtures"
```

---

## Task 2: Database Layer

**Files:**
- Create: `backend/app/database.py`
- Create: `backend/app/models/user.py`
- Create: `backend/app/models/build_job.py`

- [ ] **Step 1: Create `backend/app/database.py`**

```python
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./h5app.db")

_is_sqlite = DATABASE_URL.startswith("sqlite")
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False, "timeout": 30} if _is_sqlite else {},
)

# Enable WAL mode for SQLite to allow concurrent readers alongside the writer
if _is_sqlite:
    from sqlalchemy import event, text

    @event.listens_for(engine, "connect")
    def set_wal_mode(dbapi_conn, _):
        dbapi_conn.execute("PRAGMA journal_mode=WAL")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass
```

- [ ] **Step 2: Create `backend/app/models/user.py`**

```python
from datetime import datetime, timezone
from sqlalchemy import Integer, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    password: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
```

- [ ] **Step 3: Create `backend/app/models/build_job.py`**

```python
from datetime import datetime, timezone
from sqlalchemy import Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class BuildJob(Base):
    __tablename__ = "build_jobs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    task_id: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    h5_url: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, default="pending")  # pending/running/done/failed
    requested_platforms: Mapped[str] = mapped_column(String, nullable=False)  # JSON list
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
    finished_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    # Per-platform results
    android_path: Mapped[str | None] = mapped_column(String, nullable=True)
    android_error: Mapped[str | None] = mapped_column(String, nullable=True)
    ios_path: Mapped[str | None] = mapped_column(String, nullable=True)
    ios_error: Mapped[str | None] = mapped_column(String, nullable=True)
    macos_path: Mapped[str | None] = mapped_column(String, nullable=True)
    macos_error: Mapped[str | None] = mapped_column(String, nullable=True)
    windows_path: Mapped[str | None] = mapped_column(String, nullable=True)
    windows_error: Mapped[str | None] = mapped_column(String, nullable=True)
```

- [ ] **Step 4: Commit**

```bash
git add backend/app/database.py backend/app/models/
git commit -m "feat: database models for User and BuildJob"
```

---

## Task 3: Auth Service + URL Validator

**Files:**
- Create: `backend/app/services/auth_service.py`
- Create: `backend/app/services/url_validator.py`
- Create: `backend/tests/test_url_validator.py`

- [ ] **Step 1: Write failing URL validator tests**

Create `backend/tests/test_url_validator.py`:

```python
import pytest
from app.services.url_validator import validate_h5_url, UrlValidationError


def test_valid_https_url():
    validate_h5_url("https://example.com")  # should not raise


def test_valid_http_url():
    validate_h5_url("http://example.com/path?q=1")  # should not raise


def test_rejects_non_http_scheme():
    with pytest.raises(UrlValidationError, match="scheme"):
        validate_h5_url("ftp://example.com")


def test_rejects_file_scheme():
    with pytest.raises(UrlValidationError):
        validate_h5_url("file:///etc/passwd")


def test_rejects_localhost():
    with pytest.raises(UrlValidationError, match="internal"):
        validate_h5_url("http://localhost/app")


def test_rejects_127_0_0_1():
    with pytest.raises(UrlValidationError, match="internal"):
        validate_h5_url("http://127.0.0.1:8080/")


def test_rejects_private_192():
    with pytest.raises(UrlValidationError, match="internal"):
        validate_h5_url("http://192.168.1.1/")


def test_rejects_private_10():
    with pytest.raises(UrlValidationError, match="internal"):
        validate_h5_url("http://10.0.0.1/")


def test_rejects_private_172():
    with pytest.raises(UrlValidationError, match="internal"):
        validate_h5_url("http://172.16.0.1/")


def test_rejects_empty_string():
    with pytest.raises(UrlValidationError):
        validate_h5_url("")
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd backend
python -m pytest tests/test_url_validator.py -v 2>&1 | head -20
```
Expected: `ModuleNotFoundError` or `ImportError` (module not yet created).

- [ ] **Step 3: Create `backend/app/services/url_validator.py`**

```python
import ipaddress
import urllib.parse


class UrlValidationError(ValueError):
    pass


_PRIVATE_NETWORKS = [
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("::1/128"),
    ipaddress.ip_network("fc00::/7"),
]


def validate_h5_url(url: str) -> None:
    """Validate that url is a safe, public HTTP(S) URL. Raises UrlValidationError on failure."""
    if not url:
        raise UrlValidationError("URL must not be empty")

    parsed = urllib.parse.urlparse(url)

    if parsed.scheme not in ("http", "https"):
        raise UrlValidationError(f"URL scheme must be http or https, got '{parsed.scheme}'")

    hostname = parsed.hostname
    if not hostname:
        raise UrlValidationError("URL must have a valid hostname")

    if hostname.lower() in ("localhost", "localhost.localdomain"):
        raise UrlValidationError("URL must not point to an internal address")

    try:
        addr = ipaddress.ip_address(hostname)
        if addr.is_private or addr.is_loopback or addr.is_link_local:
            raise UrlValidationError("URL must not point to an internal address")
        for network in _PRIVATE_NETWORKS:
            if addr in network:
                raise UrlValidationError("URL must not point to an internal address")
    except ValueError:
        pass  # hostname is a domain name, not an IP — allowed
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
cd backend
python -m pytest tests/test_url_validator.py -v
```
Expected: All 10 tests PASS.

- [ ] **Step 5: Create `backend/app/services/auth_service.py`**

```python
import os
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(user_id: int, username: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    payload = {"sub": str(user_id), "username": username, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    """Returns payload dict with 'sub' (user_id str) and 'username'. Raises JWTError on failure."""
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
```

- [ ] **Step 6: Commit**

```bash
cd ..
git add backend/app/services/ backend/tests/test_url_validator.py
git commit -m "feat: URL validator with SSRF protection and JWT auth service"
```

---

## Task 4: FastAPI App + Dependencies + Schemas

**Files:**
- Create: `backend/app/dependencies.py`
- Create: `backend/app/schemas.py`
- Create: `backend/app/main.py`

- [ ] **Step 1: Create `backend/app/dependencies.py`**

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User
from app.services.auth_service import decode_access_token

bearer = HTTPBearer()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(credentials.credentials)
        user_id = int(payload["sub"])
    except (JWTError, KeyError, ValueError):
        raise credentials_exception

    user = db.get(User, user_id)
    if user is None:
        raise credentials_exception
    return user
```

- [ ] **Step 2: Create `backend/app/schemas.py`**

```python
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


# Auth
class RegisterRequest(BaseModel):
    username: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# Build
class BuildRequest(BaseModel):
    h5_url: str
    platforms: list[str]  # ["android", "ios", "macos", "windows"]


class BuildSubmitResponse(BaseModel):
    task_id: str


class PlatformStatus(BaseModel):
    status: str  # pending/running/done/failed
    download_url: Optional[str] = None
    error: Optional[str] = None


class BuildStatusResponse(BaseModel):
    task_id: str
    status: str
    h5_url: str
    created_at: datetime
    platforms: dict[str, PlatformStatus]


class HistoryItem(BaseModel):
    task_id: str
    status: str
    h5_url: str
    created_at: datetime
    requested_platforms: list[str]
```

- [ ] **Step 3: Create `backend/app/main.py`**

```python
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database import Base, engine
from app.api import auth, build

Base.metadata.create_all(bind=engine)

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
```

- [ ] **Step 4: Create empty `backend/app/api/__init__.py`**

```bash
touch backend/app/__init__.py backend/app/api/__init__.py backend/app/models/__init__.py backend/app/services/__init__.py backend/app/tasks/__init__.py backend/tests/__init__.py
```

- [ ] **Step 5: Commit**

```bash
git add backend/app/
git commit -m "feat: FastAPI app skeleton with dependencies and schemas"
```

---

## Task 5: Auth API Routes + Tests

**Files:**
- Create: `backend/app/api/auth.py`
- Create: `backend/tests/test_auth.py`

- [ ] **Step 1: Write failing auth tests**

Create `backend/tests/test_auth.py`:

```python
def test_register_success(client):
    resp = client.post("/auth/register", json={"username": "alice", "password": "pass123"})
    assert resp.status_code == 200
    assert resp.json()["access_token"]


def test_register_duplicate_username(client):
    client.post("/auth/register", json={"username": "alice", "password": "pass123"})
    resp = client.post("/auth/register", json={"username": "alice", "password": "other"})
    assert resp.status_code == 409


def test_login_success(client, registered_user):
    resp = client.post("/auth/login", json=registered_user)
    assert resp.status_code == 200
    assert resp.json()["access_token"]


def test_login_wrong_password(client, registered_user):
    resp = client.post("/auth/login", json={"username": "testuser", "password": "wrong"})
    assert resp.status_code == 401


def test_login_unknown_user(client):
    resp = client.post("/auth/login", json={"username": "nobody", "password": "x"})
    assert resp.status_code == 401
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd backend
python -m pytest tests/test_auth.py -v 2>&1 | head -30
```
Expected: ImportError or 404 responses.

- [ ] **Step 3: Create `backend/app/api/auth.py`**

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.dependencies import get_db
from app.models.user import User
from app.schemas import RegisterRequest, LoginRequest, TokenResponse
from app.services.auth_service import hash_password, verify_password, create_access_token

router = APIRouter()


@router.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    user = User(username=req.username, password=hash_password(req.password))
    db.add(user)
    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Username already exists")
    return TokenResponse(access_token=create_access_token(user.id, user.username))


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    if not user or not verify_password(req.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return TokenResponse(access_token=create_access_token(user.id, user.username))
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
cd backend
python -m pytest tests/test_auth.py -v
```
Expected: All 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
cd ..
git add backend/app/api/auth.py backend/tests/test_auth.py
git commit -m "feat: auth register/login endpoints with JWT"
```

---

## Task 6: Build API Routes + Tests

**Files:**
- Create: `backend/app/api/build.py`
- Create: `backend/app/services/file_service.py`
- Create: `backend/tests/test_build.py`

- [ ] **Step 1: Write failing build tests first** (TDD — tests before implementation)

Create `backend/tests/test_build.py` first (see Step 2 below), then create `file_service.py`.

- [ ] **Step 1a: Create `backend/app/services/file_service.py`**

```python
import json
import os
from app.models.build_job import BuildJob

BUILDS_DIR = os.getenv("BUILDS_DIR", "./builds")

PLATFORM_FILENAMES = {
    "android": "android.apk",
    "ios": "ios-unsigned.app.zip",
    "macos": "macos.dmg",
    "windows": "windows-setup.exe",
}


def artifact_dir(task_id: str) -> str:
    return os.path.join(BUILDS_DIR, task_id)


def artifact_path(task_id: str, platform: str) -> str:
    return os.path.join(artifact_dir(task_id), PLATFORM_FILENAMES[platform])


def download_url(task_id: str, platform: str) -> str:
    return f"/files/{task_id}/{PLATFORM_FILENAMES[platform]}"


def build_job_to_status_response(job: BuildJob, base_url: str = "") -> dict:
    """Convert BuildJob ORM object to the BuildStatusResponse dict format."""
    requested = json.loads(job.requested_platforms)
    platforms = {}
    for p in ["android", "ios", "macos", "windows"]:
        if p not in requested:
            continue
        path_attr = f"{p}_path"
        err_attr = f"{p}_error"
        path_val = getattr(job, path_attr)
        err_val = getattr(job, err_attr)

        if path_val:
            platforms[p] = {"status": "done", "download_url": download_url(job.task_id, p)}
        elif err_val:
            platforms[p] = {"status": "failed", "error": err_val}
        elif job.status == "running":
            platforms[p] = {"status": "running"}
        else:
            platforms[p] = {"status": "pending"}

    return {
        "task_id": job.task_id,
        "status": job.status,
        "h5_url": job.h5_url,
        "created_at": job.created_at,
        "platforms": platforms,
    }
```

- [ ] **Step 2: Write failing build tests**

Create `backend/tests/test_build.py`:

```python
from unittest.mock import patch


def test_submit_build_requires_auth(client):
    resp = client.post("/build", json={"h5_url": "https://example.com", "platforms": ["android"]})
    assert resp.status_code == 403


def test_submit_build_success(client, auth_headers):
    with patch("app.api.build.build_app.delay") as mock_task:
        mock_task.return_value.id = "fake-task-id-123"
        resp = client.post(
            "/build",
            json={"h5_url": "https://example.com", "platforms": ["android"]},
            headers=auth_headers,
        )
    assert resp.status_code == 200
    assert resp.json()["task_id"] == "fake-task-id-123"


def test_submit_build_rejects_localhost(client, auth_headers):
    resp = client.post(
        "/build",
        json={"h5_url": "http://localhost/app", "platforms": ["android"]},
        headers=auth_headers,
    )
    assert resp.status_code == 422


def test_submit_build_rejects_invalid_platform(client, auth_headers):
    resp = client.post(
        "/build",
        json={"h5_url": "https://example.com", "platforms": ["dos"]},
        headers=auth_headers,
    )
    assert resp.status_code == 422


def test_get_build_status_not_found(client, auth_headers):
    resp = client.get("/build/nonexistent-id", headers=auth_headers)
    assert resp.status_code == 404


def test_history_empty(client, auth_headers):
    resp = client.get("/builds/history", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json() == []
```

- [ ] **Step 3: Run tests — expect FAIL**

```bash
cd backend
python -m pytest tests/test_build.py -v 2>&1 | head -30
```
Expected: ImportError or 404.

- [ ] **Step 4: Create `backend/app/api/build.py`**

```python
import json
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.build_job import BuildJob
from app.models.user import User
from app.schemas import BuildRequest, BuildSubmitResponse, BuildStatusResponse, HistoryItem
from app.services.url_validator import validate_h5_url, UrlValidationError
from app.services.file_service import build_job_to_status_response
from app.tasks.build_task import build_app

VALID_PLATFORMS = {"android", "ios", "macos", "windows"}

router = APIRouter()


@router.post("/build", response_model=BuildSubmitResponse)
def submit_build(
    req: BuildRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Validate URL
    try:
        validate_h5_url(req.h5_url)
    except UrlValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))

    # Validate platforms
    invalid = set(req.platforms) - VALID_PLATFORMS
    if invalid or not req.platforms:
        raise HTTPException(status_code=422, detail=f"Invalid platforms: {invalid}")

    # Create DB record
    job = BuildJob(
        task_id=str(uuid.uuid4()),  # will be overwritten with Celery task id after delay()
        user_id=current_user.id,
        h5_url=req.h5_url,
        status="pending",
        requested_platforms=json.dumps(req.platforms),
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    # Enqueue Celery task
    celery_task = build_app.delay(job.id, req.h5_url, req.platforms)

    # Update task_id to Celery's actual task id
    job.task_id = celery_task.id
    db.commit()

    return BuildSubmitResponse(task_id=job.task_id)


@router.get("/build/{task_id}", response_model=BuildStatusResponse)
def get_build_status(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = db.query(BuildJob).filter(
        BuildJob.task_id == task_id,
        BuildJob.user_id == current_user.id,
    ).first()
    if not job:
        raise HTTPException(status_code=404, detail="Build job not found")
    return build_job_to_status_response(job)


@router.get("/files/{task_id}/{filename}")
def download_file(
    task_id: str,
    filename: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Authenticated file download — verifies the task belongs to the requesting user."""
    job = db.query(BuildJob).filter(
        BuildJob.task_id == task_id,
        BuildJob.user_id == current_user.id,
    ).first()
    if not job:
        raise HTTPException(status_code=404, detail="Build job not found")

    import os
    from fastapi.responses import FileResponse
    file_path = os.path.join(os.getenv("BUILDS_DIR", "./builds"), task_id, filename)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=filename)


@router.get("/builds/history", response_model=list[HistoryItem])
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    jobs = (
        db.query(BuildJob)
        .filter(BuildJob.user_id == current_user.id)
        .order_by(BuildJob.created_at.desc())
        .limit(50)
        .all()
    )
    return [
        HistoryItem(
            task_id=j.task_id,
            status=j.status,
            h5_url=j.h5_url,
            created_at=j.created_at,
            requested_platforms=json.loads(j.requested_platforms),
        )
        for j in jobs
    ]
```

- [ ] **Step 5: Create stub `backend/app/tasks/build_task.py`** (real impl in Task 7)

```python
from celery import Celery
import os

celery_app = Celery("h5packager")
celery_app.config_from_object("celeryconfig")

# Re-export as build_app for import compatibility
build_app = celery_app.task(name="build_app")(lambda *a, **kw: None)
```

Create `backend/celeryconfig.py`:

```python
import os

broker_url = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
result_backend = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")
task_serializer = "json"
result_serializer = "json"
accept_content = ["json"]
task_soft_time_limit = 1800   # 30 min
task_time_limit = 2700         # 45 min
worker_concurrency = 2
```

- [ ] **Step 6: Run tests — expect PASS**

```bash
cd backend
python -m pytest tests/test_build.py -v
```
Expected: All 6 tests PASS.

- [ ] **Step 7: Commit**

```bash
cd ..
git add backend/app/api/build.py backend/app/services/file_service.py \
        backend/app/tasks/build_task.py backend/celeryconfig.py \
        backend/tests/test_build.py
git commit -m "feat: build submit/status/history endpoints"
```

---

## Task 7: Celery Build Task (Real Implementation)

**Files:**
- Modify: `backend/app/tasks/build_task.py`

- [ ] **Step 1: Replace stub with real Celery task**

```python
import json
import os
import shutil
import subprocess
import tempfile
from datetime import datetime, timezone

from celery import Celery
from celery.exceptions import SoftTimeLimitExceeded
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.build_job import BuildJob
from app.services.file_service import artifact_dir, artifact_path, PLATFORM_FILENAMES

celery_app = Celery("h5packager")
celery_app.config_from_object("celeryconfig")

REPO_ROOT = os.getenv("REPO_ROOT", os.path.join(os.path.dirname(__file__), "../../../.."))
CAPACITOR_WRAPPER_SRC = os.path.join(REPO_ROOT, "capacitor-wrapper")
ELECTRON_WRAPPER_SRC = os.path.join(REPO_ROOT, "electron-wrapper")
BUILDS_DIR = os.getenv("BUILDS_DIR", os.path.join(REPO_ROOT, "builds"))


def _get_db() -> Session:
    return SessionLocal()


def _update_job(db: Session, job_id: int, **kwargs):
    db.query(BuildJob).filter(BuildJob.id == job_id).update(kwargs)
    db.commit()


def _build_android(h5_url: str, cap_dir: str) -> str:
    """Returns path to built APK."""
    _inject_capacitor_url(cap_dir, h5_url)
    _run(["npx", "cap", "sync", "android"], cwd=cap_dir)
    _run(["./gradlew", "assembleRelease"], cwd=os.path.join(cap_dir, "android"))
    return os.path.join(
        cap_dir, "android", "app", "build", "outputs", "apk", "release", "app-release.apk"
    )


def _build_ios(h5_url: str, cap_dir: str) -> str:
    """Returns path to built .app (unsigned)."""
    _inject_capacitor_url(cap_dir, h5_url)
    _run(["npx", "cap", "sync", "ios"], cwd=cap_dir)
    _run(
        ["xcodebuild", "-workspace", "App.xcworkspace", "-scheme", "App",
         "-configuration", "Release", "-derivedDataPath", "build",
         "CODE_SIGN_IDENTITY=", "CODE_SIGNING_REQUIRED=NO"],
        cwd=os.path.join(cap_dir, "ios", "App"),
    )
    return os.path.join(
        cap_dir, "ios", "App", "build", "Build", "Products", "Release-iphoneos", "App.app"
    )


def _build_macos(h5_url: str, electron_dir: str) -> str:
    """Returns path to built .dmg."""
    env = {**os.environ, "H5_URL": h5_url}
    _run(["npm", "run", "build:mac"], cwd=electron_dir, env=env)
    dist = os.path.join(electron_dir, "dist")
    dmg = next((f for f in os.listdir(dist) if f.endswith(".dmg")), None)
    if not dmg:
        raise RuntimeError("macOS build produced no .dmg file")
    return os.path.join(dist, dmg)


def _build_windows(h5_url: str, electron_dir: str) -> str:
    """Returns path to built installer."""
    env = {**os.environ, "H5_URL": h5_url}
    _run(["npm", "run", "build:win"], cwd=electron_dir, env=env)
    dist = os.path.join(electron_dir, "dist")
    exe = next((f for f in os.listdir(dist) if f.endswith(".exe")), None)
    if not exe:
        raise RuntimeError("Windows build produced no .exe file")
    return os.path.join(dist, exe)


def _inject_capacitor_url(cap_dir: str, url: str):
    config_path = os.path.join(cap_dir, "capacitor.config.ts")
    with open(config_path, "r") as f:
        content = f.read()
    # Replace the server.url value
    import re
    content = re.sub(r"url:\s*['\"].*?['\"]", f"url: '{url}'", content)
    with open(config_path, "w") as f:
        f.write(content)


def _run(cmd: list, cwd: str, env=None):
    result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, env=env)
    if result.returncode != 0:
        raise RuntimeError(f"Command {cmd[0]} failed:\n{result.stderr[-2000:]}")


PLATFORM_BUILDERS = {
    "android": lambda url, cap, ele: _build_android(url, cap),
    "ios": lambda url, cap, ele: _build_ios(url, cap),
    "macos": lambda url, cap, ele: _build_macos(url, ele),
    "windows": lambda url, cap, ele: _build_windows(url, ele),
}

PLATFORM_PATH_ATTRS = {
    "android": "android_path",
    "ios": "ios_path",
    "macos": "macos_path",
    "windows": "windows_path",
}

PLATFORM_ERROR_ATTRS = {
    "android": "android_error",
    "ios": "ios_error",
    "macos": "macos_error",
    "windows": "windows_error",
}


@celery_app.task(name="build_app", bind=True)
def build_app(self, job_id: int, h5_url: str, platforms: list[str]):
    db = _get_db()
    tmp_dir = tempfile.mkdtemp(prefix=f"build-{self.request.id}-")

    try:
        _update_job(db, job_id, status="running")

        # Copy wrappers to isolated temp dirs
        cap_tmp = os.path.join(tmp_dir, "capacitor")
        ele_tmp = os.path.join(tmp_dir, "electron")
        shutil.copytree(CAPACITOR_WRAPPER_SRC, cap_tmp)
        shutil.copytree(ELECTRON_WRAPPER_SRC, ele_tmp)

        # Install npm deps in copies
        subprocess.run(["npm", "install"], cwd=cap_tmp, capture_output=True)
        subprocess.run(["npm", "install"], cwd=ele_tmp, capture_output=True)

        # Build each platform
        out_dir = artifact_dir(self.request.id)
        os.makedirs(out_dir, exist_ok=True)

        updates = {}
        for platform in platforms:
            try:
                builder = PLATFORM_BUILDERS[platform]
                src_path = builder(h5_url, cap_tmp, ele_tmp)
                dest = artifact_path(self.request.id, platform)
                if os.path.isdir(src_path):
                    shutil.make_archive(dest.replace(".zip", ""), "zip", src_path)
                    dest = dest if dest.endswith(".zip") else dest + ".zip"
                else:
                    shutil.copy2(src_path, dest)
                updates[PLATFORM_PATH_ATTRS[platform]] = dest
            except Exception as e:
                updates[PLATFORM_ERROR_ATTRS[platform]] = str(e)

        all_failed = all(
            updates.get(PLATFORM_ERROR_ATTRS[p]) for p in platforms
        )
        final_status = "failed" if all_failed else "done"
        _update_job(
            db, job_id,
            status=final_status,
            finished_at=datetime.now(timezone.utc),
            **updates,
        )

    except SoftTimeLimitExceeded:
        _update_job(db, job_id, status="failed",
                    android_error="Build timed out (30 min limit exceeded)")
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)
        db.close()
```

- [ ] **Step 2: Commit**

```bash
git add backend/app/tasks/build_task.py
git commit -m "feat: Celery build task with per-task workspace isolation and timeout handling"
```

---

## Task 7b: Celery Task Unit Tests

**Files:**
- Create: `backend/tests/test_build_task.py`

- [ ] **Step 1: Write tests for the Celery build task logic**

Create `backend/tests/test_build_task.py`:

```python
import os
import shutil
import tempfile
from unittest.mock import MagicMock, patch, call

import pytest


def test_inject_capacitor_url_replaces_url():
    from app.tasks.build_task import _inject_capacitor_url

    with tempfile.TemporaryDirectory() as tmp:
        config_path = os.path.join(tmp, "capacitor.config.ts")
        with open(config_path, "w") as f:
            f.write("const config = { server: { url: 'https://old.com', cleartext: true } }")
        _inject_capacitor_url(tmp, "https://new.example.com")
        with open(config_path) as f:
            content = f.read()
        assert "https://new.example.com" in content
        assert "https://old.com" not in content


def test_run_raises_on_nonzero_exit():
    from app.tasks.build_task import _run
    with pytest.raises(RuntimeError, match="failed"):
        _run(["false"], cwd="/tmp")  # 'false' always exits 1


def test_run_succeeds_on_zero_exit():
    from app.tasks.build_task import _run
    _run(["true"], cwd="/tmp")  # should not raise


def test_build_app_updates_status_to_running(db):
    """Task marks job as running before building."""
    from app.models.build_job import BuildJob
    from app.models.user import User
    import json

    user = User(username="worker", password="x")
    db.add(user)
    db.commit()
    job = BuildJob(
        task_id="test-task-1",
        user_id=user.id,
        h5_url="https://example.com",
        status="pending",
        requested_platforms=json.dumps(["android"]),
    )
    db.add(job)
    db.commit()

    with patch("app.tasks.build_task.SessionLocal", return_value=db), \
         patch("app.tasks.build_task.PLATFORM_BUILDERS", {
             "android": MagicMock(side_effect=RuntimeError("build skipped"))
         }), \
         patch("app.tasks.build_task.CAPACITOR_WRAPPER_SRC", "/tmp"), \
         patch("app.tasks.build_task.ELECTRON_WRAPPER_SRC", "/tmp"), \
         patch("shutil.copytree"), \
         patch("subprocess.run"):
        try:
            # Run synchronously — task is not sent to broker
            from app.tasks.build_task import build_app
            build_app.run(job.id, "https://example.com", ["android"])
        except Exception:
            pass

    db.refresh(job)
    # Status should be "failed" (builder raised) not "pending"
    assert job.status in ("running", "failed", "done")


def test_build_app_cleans_up_tmp_on_failure():
    """Temp dir is removed even when builder throws."""
    cleaned = []

    def tracking_rmtree(path, **kwargs):
        cleaned.append(path)

    mock_db = MagicMock()
    with patch("app.tasks.build_task.SessionLocal", return_value=mock_db), \
         patch("app.tasks.build_task.CAPACITOR_WRAPPER_SRC", "/nonexistent"), \
         patch("app.tasks.build_task.ELECTRON_WRAPPER_SRC", "/nonexistent"), \
         patch("app.tasks.build_task.shutil.copytree"), \
         patch("app.tasks.build_task.subprocess.run"), \
         patch("app.tasks.build_task.shutil.rmtree", side_effect=tracking_rmtree), \
         patch("app.tasks.build_task.os.makedirs"), \
         patch("app.tasks.build_task.PLATFORM_BUILDERS", {
             "android": MagicMock(side_effect=Exception("explode"))
         }):
        from app.tasks.build_task import build_app
        build_app.run(1, "https://example.com", ["android"])

    assert len(cleaned) >= 1, "Expected shutil.rmtree to be called for cleanup"
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
cd backend
python -m pytest tests/test_build_task.py -v 2>&1 | head -30
```

- [ ] **Step 3: Run tests after Task 7 implementation — expect PASS**

```bash
python -m pytest tests/test_build_task.py -v
```
Expected: All tests PASS (or known skips for platform-specific tests).

- [ ] **Step 4: Commit**

```bash
cd ..
git add backend/tests/test_build_task.py
git commit -m "test: Celery build task unit tests"
```

---

## Task 8: Capacitor Wrapper

**Files:**
- Create: `capacitor-wrapper/package.json`
- Create: `capacitor-wrapper/capacitor.config.ts`
- Create: `capacitor-wrapper/src/index.html`

- [ ] **Step 1: Create `capacitor-wrapper/package.json`**

```json
{
  "name": "h5-capacitor-wrapper",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "cap": "cap"
  },
  "dependencies": {
    "@capacitor/android": "^6.0.0",
    "@capacitor/cli": "^6.0.0",
    "@capacitor/core": "^6.0.0",
    "@capacitor/ios": "^6.0.0"
  }
}
```

- [ ] **Step 2: Create `capacitor-wrapper/capacitor.config.ts`**

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.h5packager.app',
  appName: 'H5 App',
  webDir: 'src',
  server: {
    url: 'https://example.com',  // replaced by build_task.py per job
    cleartext: true,
  },
};

export default config;
```

- [ ] **Step 3: Create `capacitor-wrapper/src/index.html`**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>H5 App</title>
</head>
<body style="margin:0;padding:0;overflow:hidden;">
  <p>Loading...</p>
</body>
</html>
```

- [ ] **Step 4: Initialize Capacitor native projects**

```bash
cd capacitor-wrapper
npm install
npx cap init "H5 App" "com.h5packager.app" --web-dir src
npx cap add android
npx cap add ios   # only if on macOS with Xcode installed
cd ..
```

- [ ] **Step 5: Commit Capacitor wrapper (including generated native dirs)**

```bash
git add capacitor-wrapper/
git commit -m "feat: Capacitor WebView wrapper template for Android/iOS"
```

---

## Task 9: Electron Wrapper

**Files:**
- Create: `electron-wrapper/package.json`
- Create: `electron-wrapper/main.js`
- Create: `electron-wrapper/preload.js`

- [ ] **Step 1: Create `electron-wrapper/package.json`**

```json
{
  "name": "h5-electron-wrapper",
  "version": "1.0.0",
  "private": true,
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build:mac": "electron-builder --mac --x64",
    "build:win": "electron-builder --win --x64"
  },
  "dependencies": {
    "electron": "^31.0.0"
  },
  "devDependencies": {
    "electron-builder": "^24.0.0"
  },
  "build": {
    "appId": "com.h5packager.app",
    "productName": "H5 App",
    "mac": {
      "target": "dmg"
    },
    "win": {
      "target": "nsis"
    }
  }
}
```

- [ ] **Step 2: Create `electron-wrapper/main.js`**

```javascript
const { app, BrowserWindow } = require('electron');

const H5_URL = process.env.H5_URL || 'https://example.com';

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: require('path').join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  win.loadURL(H5_URL);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
```

- [ ] **Step 3: Create `electron-wrapper/preload.js`**

```javascript
// Minimal preload — no Node.js APIs exposed to renderer
window.addEventListener('DOMContentLoaded', () => {});
```

- [ ] **Step 4: Commit**

```bash
git add electron-wrapper/
git commit -m "feat: Electron wrapper template for macOS/Windows"
```

---

## Task 10: Vue Frontend Setup

**Files:**
- Create: `frontend/` (Vite scaffold)
- Create: `frontend/src/api/client.ts`
- Create: `frontend/src/stores/auth.ts`
- Create: `frontend/src/router/index.ts`

- [ ] **Step 1: Scaffold Vue 3 + Vite project**

```bash
cd frontend
npm create vite@latest . -- --template vue-ts
npm install
npm install pinia vue-router axios
npm install -D tailwindcss @tailwindcss/vite
cd ..
```

- [ ] **Step 2: Configure TailwindCSS** — edit `frontend/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    proxy: {
      '/auth': 'http://localhost:8000',
      '/build': 'http://localhost:8000',
      '/builds': 'http://localhost:8000',
      '/files': 'http://localhost:8000',
    },
  },
})
```

Add to `frontend/src/style.css`:
```css
@import "tailwindcss";
```

- [ ] **Step 3: Create `frontend/src/api/client.ts`**

```typescript
import axios from 'axios'

const client = axios.create({ baseURL: '/' })

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default client
```

- [ ] **Step 4: Create `frontend/src/stores/auth.ts`**

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('jwt_token'))

  const isLoggedIn = computed(() => !!token.value)

  function setToken(t: string) {
    token.value = t
    localStorage.setItem('jwt_token', t)
  }

  function logout() {
    token.value = null
    localStorage.removeItem('jwt_token')
  }

  return { token, isLoggedIn, setToken, logout }
})
```

- [ ] **Step 5: Create `frontend/src/router/index.ts`**

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: () => import('@/views/LoginView.vue'), meta: { public: true } },
    { path: '/', component: () => import('@/views/HomeView.vue') },
    { path: '/task/:id', component: () => import('@/views/TaskView.vue') },
    { path: '/history', component: () => import('@/views/HistoryView.vue') },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isLoggedIn) {
    return '/login'
  }
})

export default router
```

- [ ] **Step 6: Update `frontend/src/main.ts`**

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

createApp(App).use(createPinia()).use(router).mount('#app')
```

- [ ] **Step 7: Commit**

```bash
git add frontend/
git commit -m "feat: Vue 3 + Vite + Pinia + TailwindCSS frontend scaffold"
```

---

## Task 11: Frontend Views

**Files:**
- Create: `frontend/src/views/LoginView.vue`
- Create: `frontend/src/views/HomeView.vue`
- Create: `frontend/src/components/PlatformCard.vue`
- Create: `frontend/src/views/TaskView.vue`
- Create: `frontend/src/views/HistoryView.vue`
- Create: `frontend/src/composables/useAuth.ts`
- Create: `frontend/src/composables/useBuild.ts`

- [ ] **Step 1: Create `frontend/src/composables/useAuth.ts`**

```typescript
import client from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export function useAuth() {
  const auth = useAuthStore()
  const router = useRouter()

  async function login(username: string, password: string) {
    const { data } = await client.post('/auth/login', { username, password })
    auth.setToken(data.access_token)
    router.push('/')
  }

  async function register(username: string, password: string) {
    const { data } = await client.post('/auth/register', { username, password })
    auth.setToken(data.access_token)
    router.push('/')
  }

  function logout() {
    auth.logout()
    router.push('/login')
  }

  return { login, register, logout }
}
```

- [ ] **Step 2: Create `frontend/src/composables/useBuild.ts`**

```typescript
import { ref } from 'vue'
import client from '@/api/client'

export function useBuild() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function submitBuild(h5_url: string, platforms: string[]): Promise<string> {
    loading.value = true
    error.value = null
    try {
      const { data } = await client.post('/build', { h5_url, platforms })
      return data.task_id
    } catch (e: any) {
      error.value = e.response?.data?.detail ?? 'Submission failed'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function getStatus(task_id: string) {
    const { data } = await client.get(`/build/${task_id}`)
    return data
  }

  async function getHistory() {
    const { data } = await client.get('/builds/history')
    return data
  }

  return { loading, error, submitBuild, getStatus, getHistory }
}
```

- [ ] **Step 3: Create `frontend/src/views/LoginView.vue`**

```vue
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white rounded-xl shadow p-8 w-full max-w-sm">
      <h1 class="text-2xl font-bold mb-6 text-center">H5 App Packager</h1>
      <div class="flex mb-4 border-b">
        <button
          v-for="tab in ['login', 'register']"
          :key="tab"
          class="flex-1 py-2 text-sm font-medium capitalize"
          :class="activeTab === tab ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'"
          @click="activeTab = tab"
        >{{ tab }}</button>
      </div>
      <form @submit.prevent="submit" class="space-y-4">
        <input v-model="username" type="text" placeholder="Username"
          class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring" required />
        <input v-model="password" type="password" placeholder="Password"
          class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring" required />
        <p v-if="errorMsg" class="text-red-500 text-sm">{{ errorMsg }}</p>
        <button type="submit"
          class="w-full bg-blue-600 text-white rounded py-2 text-sm font-medium hover:bg-blue-700">
          {{ activeTab === 'login' ? 'Login' : 'Register' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { login, register } = useAuth()
const activeTab = ref<'login' | 'register'>('login')
const username = ref('')
const password = ref('')
const errorMsg = ref('')

async function submit() {
  errorMsg.value = ''
  try {
    if (activeTab.value === 'login') {
      await login(username.value, password.value)
    } else {
      await register(username.value, password.value)
    }
  } catch (e: any) {
    errorMsg.value = e.response?.data?.detail ?? 'Something went wrong'
  }
}
</script>
```

- [ ] **Step 4: Create `frontend/src/views/HomeView.vue`**

```vue
<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-lg mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold">Package H5 App</h1>
        <div class="space-x-2">
          <router-link to="/history" class="text-sm text-blue-600 hover:underline">History</router-link>
          <button @click="logout" class="text-sm text-gray-500 hover:underline">Logout</button>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow p-6 space-y-5">
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-1">H5 URL</label>
          <input v-model="h5Url" type="url" placeholder="https://your-h5-app.com"
            class="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring" required />
        </div>
        <div>
          <label class="text-sm font-medium text-gray-700 block mb-2">Target Platforms</label>
          <div class="grid grid-cols-2 gap-2">
            <label v-for="p in allPlatforms" :key="p.value"
              class="flex items-center gap-2 border rounded p-2 cursor-pointer hover:bg-gray-50">
              <input type="checkbox" v-model="selectedPlatforms" :value="p.value" />
              <span class="text-sm">{{ p.label }}</span>
            </label>
          </div>
        </div>
        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
        <button @click="submit" :disabled="loading || !selectedPlatforms.length"
          class="w-full bg-blue-600 text-white rounded py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
          {{ loading ? 'Submitting…' : 'Start Packaging' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useBuild } from '@/composables/useBuild'

const { logout } = useAuth()
const { submitBuild, loading, error } = useBuild()
const router = useRouter()

const h5Url = ref('')
const selectedPlatforms = ref<string[]>(['android'])
const allPlatforms = [
  { value: 'android', label: 'Android' },
  { value: 'ios', label: 'iOS (unsigned)' },
  { value: 'macos', label: 'macOS' },
  { value: 'windows', label: 'Windows' },
]

async function submit() {
  try {
    const taskId = await submitBuild(h5Url.value, selectedPlatforms.value)
    router.push(`/task/${taskId}`)
  } catch {
    // error is displayed via useBuild's error ref
  }
}
</script>
```

- [ ] **Step 5: Create `frontend/src/components/PlatformCard.vue`**

```vue
<template>
  <div class="border rounded-lg p-4 flex items-center justify-between">
    <div>
      <p class="font-medium text-sm">{{ label }}</p>
      <p class="text-xs mt-0.5" :class="statusColor">{{ statusText }}</p>
      <p v-if="platform.error" class="text-xs text-red-500 mt-1 max-w-xs truncate">{{ platform.error }}</p>
    </div>
    <a v-if="platform.download_url" :href="platform.download_url" download
      class="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700">
      Download
    </a>
    <span v-else-if="platform.status === 'running'"
      class="text-xs text-blue-500 animate-pulse">Building…</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  platform: { status: string; download_url?: string; error?: string }
}>()

const statusColor = computed(() => ({
  done: 'text-green-600',
  failed: 'text-red-500',
  running: 'text-blue-500',
  pending: 'text-gray-400',
}[props.platform.status] ?? 'text-gray-400'))

const statusText = computed(() => ({
  done: 'Ready to download',
  failed: 'Build failed',
  running: 'Building…',
  pending: 'Queued',
}[props.platform.status] ?? props.platform.status))
</script>
```

- [ ] **Step 6: Create `frontend/src/views/TaskView.vue`**

```vue
<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-lg mx-auto">
      <div class="flex items-center gap-3 mb-6">
        <router-link to="/" class="text-blue-600 text-sm hover:underline">← New Build</router-link>
        <span class="text-gray-400 text-sm">|</span>
        <router-link to="/history" class="text-blue-600 text-sm hover:underline">History</router-link>
      </div>
      <div class="bg-white rounded-xl shadow p-6">
        <h1 class="text-lg font-bold mb-1">Build Status</h1>
        <p v-if="job" class="text-xs text-gray-400 mb-4 truncate">{{ job.h5_url }}</p>
        <div v-if="job" class="space-y-3">
          <PlatformCard
            v-for="(pData, pKey) in job.platforms"
            :key="pKey"
            :label="platformLabels[pKey] ?? pKey"
            :platform="pData"
          />
        </div>
        <p v-else class="text-sm text-gray-400">Loading…</p>
        <p v-if="job?.status === 'done' || job?.status === 'failed'"
          class="mt-4 text-xs text-gray-400 text-center">
          Build finished · <router-link to="/" class="text-blue-600 hover:underline">Start a new one</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBuild } from '@/composables/useBuild'
import PlatformCard from '@/components/PlatformCard.vue'

const route = useRoute()
const { getStatus } = useBuild()

const job = ref<any>(null)
let timer: ReturnType<typeof setInterval> | null = null

const platformLabels: Record<string, string> = {
  android: 'Android',
  ios: 'iOS (unsigned)',
  macos: 'macOS',
  windows: 'Windows',
}

async function poll() {
  try {
    job.value = await getStatus(route.params.id as string)
    if (job.value.status === 'done' || job.value.status === 'failed') {
      if (timer) clearInterval(timer)
    }
  } catch {
    // token expired or network error — stop polling to avoid repeated failures
    if (timer) clearInterval(timer)
  }
}

onMounted(() => {
  poll()
  timer = setInterval(poll, 3000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
```

- [ ] **Step 7: Create `frontend/src/views/HistoryView.vue`**

```vue
<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-2xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-xl font-bold">Build History</h1>
        <router-link to="/" class="text-sm text-blue-600 hover:underline">New Build</router-link>
      </div>
      <div v-if="items.length" class="space-y-3">
        <div v-for="item in items" :key="item.task_id"
          class="bg-white rounded-lg shadow p-4 flex items-center justify-between">
          <div class="min-w-0">
            <p class="text-sm font-medium truncate">{{ item.h5_url }}</p>
            <p class="text-xs text-gray-400 mt-0.5">
              {{ new Date(item.created_at).toLocaleString() }} ·
              {{ item.requested_platforms.join(', ') }}
            </p>
          </div>
          <router-link :to="`/task/${item.task_id}`"
            :class="statusClass(item.status)"
            class="ml-4 text-xs px-2 py-1 rounded shrink-0">
            {{ item.status }}
          </router-link>
        </div>
      </div>
      <p v-else class="text-sm text-gray-400 text-center mt-16">No builds yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBuild } from '@/composables/useBuild'

const { getHistory } = useBuild()
const items = ref<any[]>([])

function statusClass(status: string) {
  return {
    done: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-600',
    running: 'bg-blue-100 text-blue-600',
    pending: 'bg-gray-100 text-gray-500',
  }[status] ?? 'bg-gray-100 text-gray-500'
}

onMounted(async () => {
  try {
    items.value = await getHistory()
  } catch {
    // token expired — router guard will redirect to /login on next navigation
  }
})
</script>
```

- [ ] **Step 8: Update `frontend/src/App.vue`**

```vue
<template>
  <router-view />
</template>
```

- [ ] **Step 9: Commit**

```bash
git add frontend/src/
git commit -m "feat: all frontend views — login, home, task status, history"
```

---

## Task 12: Docker Compose

**Files:**
- Create: `docker-compose.yml`

- [ ] **Step 1: Create `docker-compose.yml`**

```yaml
version: "3.9"

services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite:////data/h5app.db
      - CELERY_BROKER_URL=redis://redis:6379/0
      - CELERY_RESULT_BACKEND=redis://redis:6379/0
      - SECRET_KEY=change-me-in-production
      - BUILDS_DIR=/app/builds
      - REPO_ROOT=/workspace
    volumes:
      - ./builds:/app/builds
      - ./capacitor-wrapper:/workspace/capacitor-wrapper
      - ./electron-wrapper:/workspace/electron-wrapper
      - db-data:/data                       # shared SQLite volume
    depends_on:
      - redis

  celery-worker:
    build:
      context: ./backend
      dockerfile: Dockerfile
    command: celery -A app.tasks.build_task.celery_app worker --loglevel=info --concurrency=2
    environment:
      - DATABASE_URL=sqlite:////data/h5app.db
      - CELERY_BROKER_URL=redis://redis:6379/0
      - CELERY_RESULT_BACKEND=redis://redis:6379/0
      - BUILDS_DIR=/app/builds
      - REPO_ROOT=/workspace
    volumes:
      - ./builds:/app/builds
      - ./capacitor-wrapper:/workspace/capacitor-wrapper
      - ./electron-wrapper:/workspace/electron-wrapper
      - db-data:/data                       # same shared SQLite volume as backend
    depends_on:
      - redis

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5173:80"
    depends_on:
      - backend

volumes:
  db-data:   # named volume shared by backend and celery-worker for SQLite
```

- [ ] **Step 2: Create `backend/Dockerfile`**

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

- [ ] **Step 3: Create `frontend/Dockerfile`**

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

- [ ] **Step 4: Create `frontend/nginx.conf`**

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~ ^/(auth|build|builds|files)(/|$) {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
    }
}
```

- [ ] **Step 5: Commit**

```bash
git add docker-compose.yml backend/Dockerfile frontend/Dockerfile frontend/nginx.conf
git commit -m "feat: Docker Compose setup with 4 services"
```

---

## Task 13: End-to-End Verification

- [ ] **Step 1: Run backend tests**

```bash
cd backend
python -m pytest tests/ -v
```
Expected: All tests PASS.

- [ ] **Step 2: Start services (requires Redis)**

```bash
cd ..
# Option A: Docker Compose
docker-compose up --build

# Option B: Local dev
redis-server &
cd backend && uvicorn app.main:app --reload &
celery -A app.tasks.build_task.celery_app worker --loglevel=info &
cd ../frontend && npm run dev
```

- [ ] **Step 3: Manual smoke test**

1. Open http://localhost:5173
2. Register a new user
3. Submit `https://m.baidu.com` with platform `android` selected
4. Observe task status page polling updates
5. Confirm `GET /build/{task_id}` returns expected JSON structure
6. Check history page shows the submitted task

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "chore: final wiring and verification"
```

---

## Build Tool Prerequisites Checklist

Before running actual platform builds (not needed for API/frontend tests):

| Platform | Requirement |
|----------|-------------|
| Android | `java`, `android-sdk`, `ANDROID_HOME` env set |
| iOS | macOS + Xcode + `xcodebuild` in PATH |
| macOS | macOS + `npm run build:mac` (electron-builder) |
| Windows | Windows + `npm run build:win` or cross-compile on Linux |

The API and frontend fully work without build tools installed — tasks will simply report build errors per platform.
