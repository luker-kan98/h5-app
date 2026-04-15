#!/bin/zsh

cd /Users/ec2-user/h5-app/backend || exit 1

export NVM_DIR="/Users/ec2-user/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  source "$NVM_DIR/nvm.sh"
  nvm use default >/dev/null
fi

export PATH="/opt/homebrew/bin:/opt/homebrew/opt/python@3.12/libexec/bin:/opt/homebrew/opt/openjdk@17/bin:$PATH"
export JAVA_HOME="/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home"
export ANDROID_HOME="/opt/homebrew/share/android-commandlinetools"
export SECRET_KEY="${SECRET_KEY:-dev-local-2026-04-10}"
export DATABASE_URL="${DATABASE_URL:-postgresql+psycopg://h5app:h5app@127.0.0.1:5432/h5app}"
export CELERY_BROKER_URL="${CELERY_BROKER_URL:-redis://127.0.0.1:6379/0}"
export CELERY_RESULT_BACKEND="${CELERY_RESULT_BACKEND:-redis://127.0.0.1:6379/0}"
export BUILDS_DIR="${BUILDS_DIR:-/Users/ec2-user/h5-app/builds}"
export REPO_ROOT="${REPO_ROOT:-/Users/ec2-user/h5-app}"

source venv/bin/activate
exec celery -A app.tasks.build_task.celery_app worker --loglevel=info --concurrency=2 -Q celery,build.android,build.ios,build.macos,build.windows
