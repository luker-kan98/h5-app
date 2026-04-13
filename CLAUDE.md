# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**h5-app** converts H5 (web) URLs into native apps for Android, iOS, macOS, and Windows. It is a monorepo with four main components:

- `frontend/` — Vue 3 + Vite + TailwindCSS v4 + Pinia
- `backend/` — FastAPI + Celery + SQLite
- `flutter-wrapper/` — Flutter WebView template (Android/iOS/macOS/Windows)

## Commands

### Full Stack (Docker)
```bash
docker-compose up --build
```

### Frontend
```bash
cd frontend
npm run dev       # Dev server on :5173
npm run build     # Type-check + Vite build
npm run preview   # Preview production build
```

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload                                      # API on :8000
celery -A app.tasks.build_task.celery_app worker --loglevel=info   # Celery worker
python -m pytest tests/ -v                                         # Tests
```

Redis must be running for Celery (used as broker and result backend).

## Architecture

### Data Flow
1. User submits an H5 URL via frontend
2. Backend API validates URL (SSRF protection in `url_validator.py`) and creates a `BuildJob` record
3. Celery task (`build_task.py`) copies the appropriate wrapper template to a temp dir, injects the URL, and runs the platform build tools
4. Artifacts saved to `BUILDS_DIR` (default `./builds/`), build status tracked in SQLite
5. Frontend polls `/build/{task_id}` for status and downloads artifacts via `/files/{task_id}/{filename}`

### Backend Structure
- `app/main.py` — FastAPI app setup, CORS, router registration, DB init
- `app/database.py` — SQLAlchemy engine with SQLite WAL mode
- `app/models.py` — `User` and `BuildJob` ORM models
- `app/routers/` — `auth.py`, `build.py`, `files.py`, `history.py`
- `app/services/` — `auth_service.py` (JWT/passwords), `file_service.py` (artifact paths), `url_validator.py`
- `app/tasks/build_task.py` — Celery task; per-platform builders (`_build_android`, `_build_ios`, `_build_macos`, `_build_windows`)

### Frontend Structure
- `src/api/client.ts` — Axios client
- `src/composables/` — `useAuth`, `useBuild`
- `src/stores/` — Pinia auth store
- `src/views/` — Page components (Login, Home, task status, history)

### Key Environment Variables
| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | SQLite path |
| `CELERY_BROKER_URL` | Redis URL for Celery |
| `CELERY_RESULT_BACKEND` | Redis URL for results |
| `SECRET_KEY` | JWT signing key |
| `BUILDS_DIR` | Artifact storage directory |
| `REPO_ROOT` | Path used when copying wrappers |

### Build Requirements by Platform
| Platform | Requirements |
|----------|---|
| Android | Flutter + JDK + Android SDK + Gradle |
| iOS | Flutter + macOS + Xcode |
| macOS | Flutter + macOS + Xcode |
| Windows | Flutter + Visual Studio with C++ desktop workload |
