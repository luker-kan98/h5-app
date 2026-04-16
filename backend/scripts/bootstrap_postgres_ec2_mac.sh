#!/bin/zsh

set -euo pipefail

PROJECT_ROOT="${PROJECT_ROOT:-/Users/ec2-user/h5-app}"
BACKEND_DIR="${BACKEND_DIR:-$PROJECT_ROOT/backend}"
POSTGRES_FORMULA="${POSTGRES_FORMULA:-postgresql@16}"
POSTGRES_BIN_DIR="${POSTGRES_BIN_DIR:-/opt/homebrew/opt/${POSTGRES_FORMULA}/bin}"
APP_DB_NAME="${APP_DB_NAME:-h5app}"
APP_DB_USER="${APP_DB_USER:-h5app}"
APP_DB_PASSWORD="${APP_DB_PASSWORD:-replace-this-password}"
APP_DB_HOST="${APP_DB_HOST:-127.0.0.1}"
APP_DB_PORT="${APP_DB_PORT:-5432}"
SECRET_KEY_VALUE="${SECRET_KEY_VALUE:-replace-with-random-secret}"
CELERY_BROKER_URL_VALUE="${CELERY_BROKER_URL_VALUE:-redis://127.0.0.1:6379/0}"
CELERY_RESULT_BACKEND_VALUE="${CELERY_RESULT_BACKEND_VALUE:-redis://127.0.0.1:6379/0}"
BUILDS_DIR_VALUE="${BUILDS_DIR_VALUE:-$PROJECT_ROOT/builds}"
REPO_ROOT_VALUE="${REPO_ROOT_VALUE:-$PROJECT_ROOT}"
RELOAD_SERVICES="${RELOAD_SERVICES:-0}"
INSTALL_POSTGRES="${INSTALL_POSTGRES:-1}"

DATABASE_URL_VALUE="postgresql+psycopg://${APP_DB_USER}:${APP_DB_PASSWORD}@${APP_DB_HOST}:${APP_DB_PORT}/${APP_DB_NAME}"

function log() {
  printf '[bootstrap-postgres] %s\n' "$1"
}

function ensure_brew() {
  if ! command -v brew >/dev/null 2>&1; then
    log "Homebrew not found"
    exit 1
  fi
}

function ensure_postgres_installed() {
  if command -v psql >/dev/null 2>&1 && command -v createdb >/dev/null 2>&1; then
    return
  fi

  if [[ "$INSTALL_POSTGRES" != "1" ]]; then
    log "PostgreSQL tools not found and INSTALL_POSTGRES=0"
    exit 1
  fi

  ensure_brew
  log "Installing ${POSTGRES_FORMULA}"
  brew install "${POSTGRES_FORMULA}"
}

function ensure_postgres_path() {
  export PATH="${POSTGRES_BIN_DIR}:$PATH"
  if ! command -v psql >/dev/null 2>&1 || ! command -v createdb >/dev/null 2>&1; then
    log "psql/createdb still not found after PATH update"
    exit 1
  fi
}

function ensure_postgres_running() {
  ensure_brew
  log "Starting ${POSTGRES_FORMULA} via brew services"
  brew services start "${POSTGRES_FORMULA}" >/dev/null
  pg_isready -h "${APP_DB_HOST}" -p "${APP_DB_PORT}" >/dev/null
}

function ensure_database_user() {
  log "Ensuring PostgreSQL role ${APP_DB_USER}"
  psql postgres <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '${APP_DB_USER}') THEN
    CREATE ROLE ${APP_DB_USER} LOGIN PASSWORD '${APP_DB_PASSWORD}';
  ELSE
    ALTER ROLE ${APP_DB_USER} WITH LOGIN PASSWORD '${APP_DB_PASSWORD}';
  END IF;
END
\$\$;
SQL
}

function ensure_database() {
  log "Ensuring PostgreSQL database ${APP_DB_NAME}"
  if ! psql postgres -tAc "SELECT 1 FROM pg_database WHERE datname='${APP_DB_NAME}'" | grep -q 1; then
    createdb -O "${APP_DB_USER}" "${APP_DB_NAME}"
  fi
}

function ensure_backend_venv() {
  cd "${BACKEND_DIR}"
  if [[ ! -x "venv/bin/python" ]]; then
    log "backend virtualenv not found at ${BACKEND_DIR}/venv"
    exit 1
  fi
}

function install_backend_requirements() {
  log "Installing backend requirements"
  source venv/bin/activate
  pip install -r requirements.txt
}

function export_runtime_env() {
  export DATABASE_URL="${DATABASE_URL_VALUE}"
  export SECRET_KEY="${SECRET_KEY_VALUE}"
  export CELERY_BROKER_URL="${CELERY_BROKER_URL_VALUE}"
  export CELERY_RESULT_BACKEND="${CELERY_RESULT_BACKEND_VALUE}"
  export BUILDS_DIR="${BUILDS_DIR_VALUE}"
  export REPO_ROOT="${REPO_ROOT_VALUE}"
}

function initialize_schema() {
  log "Initializing single-host scheduler schema"
  python scripts/migrate_single_host_scheduler.py --database-url "${DATABASE_URL}"
}

function reload_launchd_service() {
  local plist_path="$1"
  launchctl bootout "gui/$(id -u)" "${plist_path}" >/dev/null 2>&1 || true
  launchctl bootstrap "gui/$(id -u)" "${plist_path}"
}

function maybe_reload_services() {
  if [[ "${RELOAD_SERVICES}" != "1" ]]; then
    log "Skipping launchd reload because RELOAD_SERVICES=${RELOAD_SERVICES}"
    return
  fi

  log "Reloading backend launchd services"
  reload_launchd_service "${BACKEND_DIR}/launchd/com.h5app.backend.plist"
  reload_launchd_service "${BACKEND_DIR}/launchd/com.h5app.celery.plist"
  reload_launchd_service "${BACKEND_DIR}/launchd/com.h5app.scheduler.plist"
}

function print_summary() {
  cat <<EOF
[bootstrap-postgres] Completed
DATABASE_URL=${DATABASE_URL}
RELOAD_SERVICES=${RELOAD_SERVICES}

Next checks:
  launchctl print gui/\$(id -u)/com.h5app.backend
  launchctl print gui/\$(id -u)/com.h5app.celery
  launchctl print gui/\$(id -u)/com.h5app.scheduler
  tail -n 100 /tmp/h5-app-backend.log
  tail -n 100 /tmp/h5-app-celery.log
  tail -n 100 /tmp/h5-app-scheduler.log
EOF
}

ensure_postgres_installed
ensure_postgres_path
ensure_postgres_running
ensure_database_user
ensure_database
ensure_backend_venv
install_backend_requirements
export_runtime_env
initialize_schema
maybe_reload_services
print_summary
