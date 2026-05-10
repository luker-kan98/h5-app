#!/bin/zsh
set -e

ROOT="/Users/ec2-user/h5-app"

echo "==> 重新打包 maccms (主前端)..."
cd "$ROOT/maccms"
if [ ! -d node_modules ]; then
  yarn install --frozen-lockfile
fi
yarn build

echo "==> 重载 nginx..."
nginx -c "$ROOT/frontend/nginx.local.conf" -s reload

echo "==> 重启后端 (uvicorn)..."
pkill -f "uvicorn app.main:app" 2>/dev/null || true
sleep 1
nohup "$ROOT/backend/scripts/start_backend.sh" > /tmp/h5-app-backend.log 2>&1 &
echo $! > /tmp/h5-app-backend.pid

echo "==> 重启 celery worker..."
# Kill all existing celery workers for this app
pkill -f "celery -A app.tasks.build_task" 2>/dev/null || true
sleep 2
nohup "$ROOT/backend/scripts/start_celery.sh" > /tmp/h5-app-celery.log 2>&1 &
echo $! > /tmp/h5-app-celery.pid

echo "==> 重启 scheduler daemon..."
pkill -f "app.run_scheduler" 2>/dev/null || true
sleep 1
nohup "$ROOT/backend/scripts/start_scheduler.sh" > /tmp/h5-app-scheduler.log 2>&1 &
echo $! > /tmp/h5-app-scheduler.pid

sleep 1
echo ""
echo "==> 重载完成"
echo "  前端 (maccms): http://localhost"
echo "  后端: http://localhost:8000"
echo "  日志: /tmp/h5-app-backend.log, /tmp/h5-app-celery.log, /tmp/h5-app-scheduler.log"
