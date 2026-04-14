# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**h5-app** converts H5 (web) URLs into native apps for Android, iOS, macOS, and Windows. It is a monorepo with three main components:

- `frontend/` — Vue 3 + Vite + TailwindCSS v4 + Pinia
- `backend/` — FastAPI + Celery + SQLite
- `flutter-wrapper/` — Flutter WebView template for Android/iOS
- `electron-wrapper/` — Electron template for macOS/Windows desktop builds

## Commands

### Full Stack (Docker)
```bash
docker-compose up --build        # Frontend on :5173, API on :8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev       # Dev server on :5173
npm run build     # vue-tsc type-check + Vite build
npm run preview   # Preview production build
```
No linter or formatter is configured — `npm run build` (which runs `vue-tsc -b`) is the only code quality check.

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload                                      # API on :8000
celery -A app.tasks.build_task.celery_app worker --loglevel=info   # Celery worker (requires Redis)
```

### Tests
```bash
cd backend
python -m pytest tests/ -v                          # All tests
python -m pytest tests/test_auth.py -v              # Single file
python -m pytest tests/test_auth.py::test_name -v   # Single test
```
Tests use an in-memory SQLite database (no Redis needed). The `conftest.py` provides `client`, `db`, `registered_user`, and `auth_headers` fixtures.

## Architecture

### Data Flow
1. User submits an H5 URL + platform list via the frontend (Form data, not JSON — the build endpoint also accepts optional keystore file upload for Android signing)
2. Backend validates URL (SSRF protection in `url_validator.py`), creates a `BuildJob` record
3. Celery task copies the appropriate wrapper to a temp dir — `flutter-wrapper/` for Android/iOS (URL injected via `--dart-define=H5_URL=...`), `electron-wrapper/` for macOS/Windows (URL injected by replacing `__H5_URL__` placeholder in `main.js`) — then runs the platform build
4. Artifacts saved to `BUILDS_DIR` (default `./builds/{task_id}/`), build status tracked in SQLite
5. Frontend polls `GET /build/{task_id}` for status; downloads via `GET /files/{task_id}/{filename}` (authenticated)

### Backend Structure
- `app/main.py` — FastAPI app, CORS, router registration, DB table creation
- `app/database.py` — SQLAlchemy engine with SQLite WAL mode
- `app/schemas.py` — Pydantic request/response models
- `app/dependencies.py` — `get_db` session factory, `get_current_user` JWT auth dependency
- `app/models/` — `user.py` (User ORM), `build_job.py` (BuildJob ORM with per-platform path/error columns)
- `app/api/auth.py` — `/auth/register`, `/auth/login` endpoints
- `app/api/build.py` — `/build` (submit), `/build/{task_id}` (status), `/files/{task_id}/{filename}` (download), `/builds/history`
- `app/services/auth_service.py` — JWT creation/decoding, password hashing
- `app/services/url_validator.py` — SSRF protection (blocks private IPs, localhost)
- `app/services/file_service.py` — artifact path helpers, `build_job_to_status_response` converter
- `app/tasks/build_task.py` — Celery task with per-platform builders; Android/iOS use Flutter, macOS/Windows use Electron (via electron-builder)
- `celeryconfig.py` — Celery config (30 min soft limit, 45 min hard limit, concurrency=2)

### Frontend Structure
- `src/api/client.ts` — Axios client with auth interceptor
- `src/composables/useAuth.ts`, `useBuild.ts` — composition API hooks
- `src/stores/auth.ts` — Pinia auth store
- `src/views/` — LoginView, HomeView, TaskView, HistoryView
- `src/router/index.ts` — Vue Router config

### Key Environment Variables
| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | SQLite connection string (default `sqlite:///./h5app.db`) |
| `CELERY_BROKER_URL` | Redis URL for Celery broker |
| `CELERY_RESULT_BACKEND` | Redis URL for Celery results |
| `SECRET_KEY` | JWT signing key |
| `BUILDS_DIR` | Artifact storage directory |
| `REPO_ROOT` | Repo root path for locating `flutter-wrapper/` and `electron-wrapper/` |

### Build Requirements by Platform
| Platform | Tools Required |
|----------|---|
| Android | Flutter + JDK + Android SDK + Gradle |
| iOS | Flutter + macOS + Xcode (produces unsigned .app) |
| macOS | Node.js + electron-builder (produces .dmg) |
| Windows | Node.js + electron-builder (produces .exe installer via NSIS) |
