# Repository Guidelines

## Project Structure & Module Organization
This monorepo packages H5 sites as native apps. `frontend/` contains the Vue 3 + Vite UI (`src/views`, `src/components`, `src/composables`, `src/stores`). `backend/` contains the FastAPI API, Celery jobs, and tests (`app/api`, `app/services`, `app/tasks`, `tests`). `flutter-wrapper/` holds the Android/iOS template, and `electron-wrapper/` holds the macOS/Windows template. Build artifacts go to `builds/`; design notes live in `docs/`.

## Build, Test, and Development Commands
- `docker-compose up --build` runs the full stack locally (Redis, backend, worker, frontend).
- `cd frontend && npm install && npm run dev` starts the Vite app on `:5173`.
- `cd frontend && npm run build` runs `vue-tsc -b` and creates the production bundle.
- `cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload` starts the API on `:8000`.
- `cd backend && celery -A app.tasks.build_task.celery_app worker --loglevel=info` starts the build worker; Redis is required.
- `cd backend && python -m pytest tests/ -v` runs backend tests.
- `cd flutter-wrapper && flutter test` validates the Flutter wrapper.

## Coding Style & Naming Conventions
Follow the existing style in each module. Vue and TypeScript files use 2-space indentation, PascalCase for components/views (`HomeView.vue`), and `useX.ts` for composables (`useBuild.ts`). Python uses 4-space indentation, snake_case modules, and thin API/router files that delegate to `services/` or `tasks/`. Keep the frontend `@/` import alias. No repo-wide ESLint or Prettier config is checked in, so use build/test commands as the quality gate. Flutter should remain compatible with `flutter_lints`.

## Testing Guidelines
Backend tests use `pytest` with files named `test_*.py`; keep shared fixtures in `backend/tests/conftest.py`. Add or update tests whenever API behavior, auth, validation, or build orchestration changes. For frontend and wrapper changes without automated coverage, include manual verification steps in the PR.

## Commit & Pull Request Guidelines
Recent history favors short, imperative messages, often with a prefix such as `fix:`. Prefer `type: concise summary`, for example `fix: validate uploaded keystore path`. Keep commits focused by area. PRs should describe the affected module, list commands run, link the related issue/task, and include screenshots for UI changes. Note platform-specific build assumptions when touching Flutter or Electron packaging.

## Security & Configuration Tips
Do not commit real secrets, keystores, local SQLite databases, or generated artifacts. Backend and Celery settings such as `SECRET_KEY`, `DATABASE_URL`, `BUILDS_DIR`, and `REPO_ROOT` should be provided via environment variables.
