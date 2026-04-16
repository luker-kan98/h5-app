# 当前部署说明（2026-04-13）

本文档描述 `/Users/ec2-user/h5-app` 当前这台机器上的实际运行部署，而不是通用开发或 Docker 部署方案。

## 当前访问入口

- 前端入口：`http://localhost/`
- 前端服务端口：`80`
- 后端 API：`http://127.0.0.1:8000`
- 后端文档：`http://127.0.0.1:8000/docs`

## 当前架构

```text
Browser
  -> Nginx (:80)
     -> frontend/dist
     -> reverse proxy /auth /build /builds /files
        -> FastAPI (:8000)
           -> Redis (:6379)
           -> Celery Worker
              -> flutter-wrapper / electron-wrapper
              -> builds/
```

## 前端部署

- 前端代码目录：`/Users/ec2-user/h5-app/frontend`
- 当前提供的是打包后的静态文件，不是 `vite dev server`
- 静态文件目录：`/Users/ec2-user/h5-app/frontend/dist`
- Nginx 本地配置：`/Users/ec2-user/h5-app/frontend/nginx.local.conf`
- Nginx 二进制：`/opt/homebrew/opt/nginx/bin/nginx`

当前 Nginx 配置行为：

- 监听 `80`
- 根目录指向 `frontend/dist`
- SPA 路由通过 `try_files ... /index.html` 回退
- `/auth`、`/build`、`/builds`、`/files` 反向代理到 `127.0.0.1:8000`

## 后端部署

- 后端代码目录：`/Users/ec2-user/h5-app/backend`
- API 服务：FastAPI + Uvicorn
- Worker：Celery
- 调度器：单机 scheduler daemon
- Broker / Result Backend：Redis `127.0.0.1:6379/0`
- 数据库：PostgreSQL，默认连接 `postgresql+psycopg://h5app:h5app@127.0.0.1:5432/h5app`
- 构建产物目录：`/Users/ec2-user/h5-app/builds`

后端以 macOS `launchd` 的 LaunchAgent 方式常驻运行，退出当前会话后仍会继续运行。

### LaunchAgent

- Backend plist：`/Users/ec2-user/h5-app/backend/launchd/com.h5app.backend.plist`
- Celery plist：`/Users/ec2-user/h5-app/backend/launchd/com.h5app.celery.plist`
- Scheduler plist：`/Users/ec2-user/h5-app/backend/launchd/com.h5app.scheduler.plist`
- Backend label：`com.h5app.backend`
- Celery label：`com.h5app.celery`
- Scheduler label：`com.h5app.scheduler`

### 启动脚本

- Backend 脚本：`/Users/ec2-user/h5-app/backend/scripts/start_backend.sh`
- Celery 脚本：`/Users/ec2-user/h5-app/backend/scripts/start_celery.sh`
- Scheduler 脚本：`/Users/ec2-user/h5-app/backend/scripts/start_scheduler.sh`

脚本中的默认环境变量：

```bash
SECRET_KEY=dev-local-2026-04-10
DATABASE_URL=postgresql+psycopg://h5app:h5app@127.0.0.1:5432/h5app
CELERY_BROKER_URL=redis://127.0.0.1:6379/0
CELERY_RESULT_BACKEND=redis://127.0.0.1:6379/0
BUILDS_DIR=/Users/ec2-user/h5-app/builds
REPO_ROOT=/Users/ec2-user/h5-app
JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
```

生产推荐配置文件：

- `/Users/ec2-user/h5-app/backend/.env.production`
- 模板文件：[.env.production.example](/Users/hhy/project/h5-app/backend/.env.production.example)

当前三个 `launchd plist` 都显式注入了 `ENV_FILE=/Users/ec2-user/h5-app/backend/.env.production`。
如果该文件存在，启动脚本会优先加载其中的生产值。

## 日志位置

- Nginx access log：`/tmp/h5-app-nginx-access.log`
- Nginx error log：`/tmp/h5-app-nginx-error.log`
- Backend log：`/tmp/h5-app-backend.log`
- Celery log：`/tmp/h5-app-celery.log`
- Scheduler log：`/tmp/h5-app-scheduler.log`

## 当前状态核验

以下状态在 `2026-04-13` 已核验：

- `http://127.0.0.1:80/` 返回 `200 OK`
- `http://127.0.0.1:8000/docs` 返回 `200 OK`
- `launchctl print gui/501/com.h5app.backend` 显示 `state = running`
- `launchctl print gui/501/com.h5app.celery` 显示 `state = running`
- `launchctl print gui/501/com.h5app.scheduler` 显示 `state = running`
- `redis-cli -p 6379 ping` 返回 `PONG`
- Celery 日志显示 worker `ready`
- Scheduler 日志持续输出调度周期结果

## 运维命令

### 查看状态

```bash
curl -I http://127.0.0.1:80/
curl -I http://127.0.0.1:8000/docs
launchctl print gui/$(id -u)/com.h5app.backend
launchctl print gui/$(id -u)/com.h5app.celery
launchctl print gui/$(id -u)/com.h5app.scheduler
tail -n 50 /tmp/h5-app-backend.log
tail -n 50 /tmp/h5-app-celery.log
tail -n 50 /tmp/h5-app-scheduler.log
```

### 重载后端服务

```bash
launchctl bootout gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.backend.plist
launchctl bootstrap gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.backend.plist

launchctl bootout gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.celery.plist
launchctl bootstrap gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.celery.plist

launchctl bootout gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.scheduler.plist
launchctl bootstrap gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.scheduler.plist
```

### 初始化全新 PostgreSQL 数据库

```bash
cd /Users/ec2-user/h5-app/backend
source venv/bin/activate
createdb h5app
python scripts/migrate_single_host_scheduler.py
```

如需对其他 PostgreSQL 库初始化，可显式传入：

```bash
python scripts/migrate_single_host_scheduler.py --database-url postgresql+psycopg://user:pass@host:5432/dbname
```

### 重建前端并重新加载 Nginx

```bash
cd /Users/ec2-user/h5-app/frontend
npm run build
/opt/homebrew/opt/nginx/bin/nginx -t -c /Users/ec2-user/h5-app/frontend/nginx.local.conf
/opt/homebrew/opt/nginx/bin/nginx -s reload
```

如果 Nginx 尚未运行，可使用：

```bash
/opt/homebrew/opt/nginx/bin/nginx -c /Users/ec2-user/h5-app/frontend/nginx.local.conf
```

## 注意事项

- 当前前端不是开发热更新模式；修改前端代码后需要重新执行 `npm run build`
- Nginx 当前不是通过 `launchd` 托管，而是手动启动的常驻进程
- Redis 当前已存在并可用，但本文档不包含 Redis 的安装与托管方式
- `SECRET_KEY` 仍是本地开发值，不适合正式生产环境
