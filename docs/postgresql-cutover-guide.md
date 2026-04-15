# PostgreSQL Cutover Guide

本文档用于把当前单机部署切换到 **全新 PostgreSQL 数据库**。

如果你要的是直接在 EC2 Mac 上逐条执行的命令版，见：
[postgresql-cutover-ec2-mac.md](/Users/ec2-user/h5-app/docs/postgresql-cutover-ec2-mac.md)

适用范围：

- 当前后端运行在单机 EC2 Mac 上
- Redis / FastAPI / Celery / scheduler 已具备运行条件
- 不需要从旧 SQLite 拷贝历史数据
- 目标是直接启用全新的生产 PostgreSQL 库

不适用范围：

- 需要保留旧 SQLite 历史数据
- 多主机或多环境并行切换

## 目标状态

切换完成后，后端默认使用：

```bash
DATABASE_URL=postgresql+psycopg://h5app:h5app@127.0.0.1:5432/h5app
```

三个常驻进程都连接同一个 PostgreSQL：

- backend
- celery worker
- scheduler daemon

## 相关文件

- 数据库默认配置：[database.py](/Users/hhy/project/h5-app/backend/app/database.py)
- Backend 启动脚本：[start_backend.sh](/Users/hhy/project/h5-app/backend/scripts/start_backend.sh)
- Celery 启动脚本：[start_celery.sh](/Users/hhy/project/h5-app/backend/scripts/start_celery.sh)
- Scheduler 启动脚本：[start_scheduler.sh](/Users/hhy/project/h5-app/backend/scripts/start_scheduler.sh)
- 新库初始化脚本：[migrate_single_host_scheduler.py](/Users/hhy/project/h5-app/backend/scripts/migrate_single_host_scheduler.py)
- 当前部署说明：[current-deployment-2026-04-13.md](/Users/hhy/project/h5-app/docs/current-deployment-2026-04-13.md)

## 1. 前置检查

先确认当前机器具备以下条件：

- PostgreSQL 已安装
- `psql` 和 `createdb` 可用
- Redis 正常运行
- 后端虚拟环境存在

检查命令：

```bash
which psql
which createdb
redis-cli -p 6379 ping
cd /Users/ec2-user/h5-app/backend
test -x venv/bin/python && echo ok
```

## 2. 安装后端依赖

确保 PostgreSQL 驱动已安装到虚拟环境。

```bash
cd /Users/ec2-user/h5-app/backend
source venv/bin/activate
pip install -r requirements.txt
```

当前依赖里已经包含：

- `psycopg[binary]`

## 3. 创建全新数据库

如果本机 PostgreSQL 已启动，执行：

```bash
createdb h5app
```

如果你要使用别的库名，可自行替换，并在后续 `DATABASE_URL` 保持一致。

建议同时创建独立数据库用户，而不是长期使用默认本地超级用户。

示例：

```sql
CREATE ROLE h5app LOGIN PASSWORD 'replace-this-password';
CREATE DATABASE h5app OWNER h5app;
```

对应连接串：

```bash
postgresql+psycopg://h5app:replace-this-password@127.0.0.1:5432/h5app
```

## 4. 初始化 schema

对全新 PostgreSQL 数据库执行初始化：

```bash
cd /Users/ec2-user/h5-app/backend
source venv/bin/activate
python scripts/migrate_single_host_scheduler.py
```

如果数据库名、用户或地址不同，显式传参：

```bash
python scripts/migrate_single_host_scheduler.py \
  --database-url postgresql+psycopg://h5app:replace-this-password@127.0.0.1:5432/h5app
```

预期输出类似：

```text
created_requests=0
created_tasks=0
reused_requests=0
reused_tasks=0
migration_recorded=true
```

对于全新数据库，`created_*` 为 `0` 是正常的，因为没有旧 `build_jobs` 数据需要回填。

## 5. 配置运行环境

当前三个启动脚本都支持环境变量覆盖默认值。

建议在正式环境中显式设置：

```bash
export DATABASE_URL="postgresql+psycopg://h5app:replace-this-password@127.0.0.1:5432/h5app"
export SECRET_KEY="replace-with-random-secret"
export CELERY_BROKER_URL="redis://127.0.0.1:6379/0"
export CELERY_RESULT_BACKEND="redis://127.0.0.1:6379/0"
export BUILDS_DIR="/Users/ec2-user/h5-app/builds"
export REPO_ROOT="/Users/ec2-user/h5-app"
```

如果继续使用当前脚本中的默认值，也能启动，但默认密码和 `SECRET_KEY` 不适合生产。

## 6. 重载三个服务

切换数据库后，需要一起重载：

```bash
launchctl bootout gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.backend.plist
launchctl bootstrap gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.backend.plist

launchctl bootout gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.celery.plist
launchctl bootstrap gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.celery.plist

launchctl bootout gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.scheduler.plist
launchctl bootstrap gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.scheduler.plist
```

## 7. 切换后验证

### 进程状态

```bash
launchctl print gui/$(id -u)/com.h5app.backend
launchctl print gui/$(id -u)/com.h5app.celery
launchctl print gui/$(id -u)/com.h5app.scheduler
```

### 日志

```bash
tail -n 100 /tmp/h5-app-backend.log
tail -n 100 /tmp/h5-app-celery.log
tail -n 100 /tmp/h5-app-scheduler.log
```

### API

```bash
curl -I http://127.0.0.1:8000/docs
curl -I http://127.0.0.1:80/
```

### 数据库连通性

```bash
psql postgresql://h5app:replace-this-password@127.0.0.1:5432/h5app -c '\dt'
```

至少应看到这些表：

- `users`
- `build_jobs`
- `build_requests`
- `build_tasks`
- `host_resource_samples`
- `schema_migrations`

### 提交一次测试构建

切换后建议提交一次最小 Android 构建，确认：

- `/build` 可成功返回 `request_id`
- 任务先进入 `submitted` / `waiting_capacity` / `queued`
- worker 能把任务推进到 `running`
- 最终能生成产物

## 8. 回滚方案

如果 PostgreSQL 切换失败，而你只需要尽快恢复服务，可临时回退为 SQLite：

```bash
export DATABASE_URL="sqlite:///./h5app.db"
```

然后重载 backend / celery / scheduler 三个服务。

注意：

- 这种回滚只适用于你仍保留旧 SQLite 文件的情况
- 因为这次是“全新 PostgreSQL 库”方案，PostgreSQL 中的新数据不会自动回写到 SQLite

## 9. 生产建议

- 使用独立 PostgreSQL 用户，不要直接用超级用户
- 替换默认 `SECRET_KEY`
- 替换默认数据库密码
- 为 PostgreSQL 做备份和磁盘监控
- 把 `DATABASE_URL` 放进正式环境变量管理，而不是长期依赖脚本默认值
- 切换完成后，优先观察 `/tmp/h5-app-scheduler.log`，确保 admission 调度持续运行

## 10. 最短执行路径

如果你只需要最短可执行步骤，按这个顺序执行：

```bash
cd /Users/ec2-user/h5-app/backend
source venv/bin/activate
pip install -r requirements.txt
createdb h5app
python scripts/migrate_single_host_scheduler.py

launchctl bootout gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.backend.plist
launchctl bootstrap gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.backend.plist

launchctl bootout gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.celery.plist
launchctl bootstrap gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.celery.plist

launchctl bootout gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.scheduler.plist
launchctl bootstrap gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.scheduler.plist
```

执行后再看：

```bash
tail -n 100 /tmp/h5-app-backend.log
tail -n 100 /tmp/h5-app-celery.log
tail -n 100 /tmp/h5-app-scheduler.log
```
