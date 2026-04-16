# PostgreSQL Cutover Guide For EC2 Mac

本文档是 [postgresql-cutover-guide.md](/Users/ec2-user/h5-app/docs/postgresql-cutover-guide.md) 的 **EC2 Mac 实操版**。

目标：

- 在单机 EC2 Mac 上安装并启动 PostgreSQL
- 创建全新生产库
- 初始化后端 schema
- 重载 backend / celery / scheduler
- 完成切换验证

默认路径：

- 项目目录：`/Users/ec2-user/h5-app`
- 后端目录：`/Users/ec2-user/h5-app/backend`
- 构建产物目录：`/Users/ec2-user/h5-app/builds`

默认连接串：

```bash
postgresql+psycopg://h5app:replace-this-password@127.0.0.1:5432/h5app
```

生产模板文件：

- [.env.production.example](/Users/hhy/project/h5-app/backend/.env.production.example)

## 1. 安装 PostgreSQL

如果机器尚未安装 PostgreSQL，执行：

```bash
brew update
brew install postgresql@16
```

把 PostgreSQL 加进 PATH：

```bash
echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zprofile
export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"
```

确认命令可用：

```bash
which psql
which createdb
psql --version
```

## 2. 启动 PostgreSQL

用 Homebrew service 启动：

```bash
brew services start postgresql@16
```

检查状态：

```bash
brew services list | grep postgresql
pg_isready -h 127.0.0.1 -p 5432
```

如果 `pg_isready` 返回 `accepting connections`，说明 PostgreSQL 已正常监听。

## 3. 创建数据库用户和数据库

先进入默认本地数据库：

```bash
psql postgres
```

执行以下 SQL：

```sql
CREATE ROLE h5app LOGIN PASSWORD 'replace-this-password';
CREATE DATABASE h5app OWNER h5app;
\q
```

然后验证连接：

```bash
psql postgresql://h5app:replace-this-password@127.0.0.1:5432/h5app -c 'select current_database(), current_user;'
```

## 4. 安装后端依赖

进入后端目录并安装依赖：

```bash
cd /Users/ec2-user/h5-app/backend
source venv/bin/activate
pip install -r requirements.txt
```

当前依赖已包含：

- `psycopg[binary]`
- `psutil`

## 4.1 一键引导脚本

如果你希望把安装和初始化串起来执行，可以直接使用：

```bash
cd /Users/ec2-user/h5-app/backend
chmod +x scripts/bootstrap_postgres_ec2_mac.sh
APP_DB_PASSWORD='replace-this-password' \
SECRET_KEY_VALUE='replace-with-random-secret' \
RELOAD_SERVICES=1 \
./scripts/bootstrap_postgres_ec2_mac.sh
```

脚本位置：

- [bootstrap_postgres_ec2_mac.sh](/Users/hhy/project/h5-app/backend/scripts/bootstrap_postgres_ec2_mac.sh)

默认行为：

- 若缺少 PostgreSQL，则通过 `brew install postgresql@16` 安装
- 启动 `brew services start postgresql@16`
- 确保 `h5app` 用户和 `h5app` 数据库存在
- 安装后端依赖
- 初始化 schema
- 当 `RELOAD_SERVICES=1` 时，重载 backend / celery / scheduler

如果你只想初始化数据库，不想动运行中的服务，保留默认：

```bash
RELOAD_SERVICES=0 ./scripts/bootstrap_postgres_ec2_mac.sh
```

## 5. 设置数据库连接串

本次切换推荐先落 `.env.production`，让 `launchd` 和三个启动脚本统一从同一个文件读配置：

```bash
cd /Users/ec2-user/h5-app/backend
cp .env.production.example .env.production
```

编辑 `.env.production`，至少替换：

- `SECRET_KEY`
- `DATABASE_URL`

三个 `launchd plist` 已显式注入：

- `ENV_FILE=/Users/ec2-user/h5-app/backend/.env.production`

所以只要这个文件存在，backend / celery / scheduler 启动时都会优先加载它。

如果你需要临时验证，也可以显式导出环境变量，不依赖文件：

```bash
export DATABASE_URL="postgresql+psycopg://h5app:replace-this-password@127.0.0.1:5432/h5app"
export SECRET_KEY="replace-with-random-secret"
export CELERY_BROKER_URL="redis://127.0.0.1:6379/0"
export CELERY_RESULT_BACKEND="redis://127.0.0.1:6379/0"
export BUILDS_DIR="/Users/ec2-user/h5-app/builds"
export REPO_ROOT="/Users/ec2-user/h5-app"
```

如果你已经写好 `.env.production`，这一步可以跳过。

## 6. 初始化全新数据库 schema

在后端虚拟环境里执行：

```bash
cd /Users/ec2-user/h5-app/backend
source venv/bin/activate
python scripts/migrate_single_host_scheduler.py --database-url "$DATABASE_URL"
```

预期输出类似：

```text
created_requests=0
created_tasks=0
reused_requests=0
reused_tasks=0
migration_recorded=true
```

这代表：

- 新表已创建
- 没有旧 `build_jobs` 需要回填
- `schema_migrations` 已记录初始化

## 7. 重载三个后端进程

按顺序重载：

```bash
launchctl bootout gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.backend.plist
launchctl bootstrap gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.backend.plist

launchctl bootout gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.celery.plist
launchctl bootstrap gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.celery.plist

launchctl bootout gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.scheduler.plist
launchctl bootstrap gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.scheduler.plist
```

如果某个服务当前未加载，`bootout` 失败可以忽略，继续执行对应的 `bootstrap`。

## 8. 检查运行状态

### `launchd`

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

### PostgreSQL 表

```bash
psql "$DATABASE_URL" -c '\dt'
```

至少应看到：

- `build_jobs`
- `build_requests`
- `build_tasks`
- `host_resource_samples`
- `schema_migrations`
- `users`

### HTTP 健康检查

```bash
curl -I http://127.0.0.1:8000/docs
curl -I http://127.0.0.1:80/
```

## 9. 提交一次最小构建验证

切换完成后，建议提交一次 Android 构建：

1. 登录前端
2. 选择 Android
3. 上传 1024x1024 PNG
4. 提交一个简单 H5 URL

然后验证：

- `/build` 返回 `request_id`
- 任务状态能从 `submitted` / `waiting_capacity` 往前推进
- worker 可以进入 `running`
- 构建能产出 APK

## 10. 常见问题

### `psql: command not found`

说明 PATH 没带上 PostgreSQL：

```bash
export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"
```

### `database "h5app" already exists`

这是正常情况，说明库已经建过了。可以继续执行 schema 初始化脚本。

### `role "h5app" already exists`

说明用户已经建过了。确认密码和连接串一致即可。

### `connection refused`

先检查 PostgreSQL 是否真的启动：

```bash
brew services list | grep postgresql
pg_isready -h 127.0.0.1 -p 5432
```

### 后端日志里出现 `password authentication failed`

说明 `DATABASE_URL` 中的用户名或密码和 PostgreSQL 中的不一致。重新核对：

```bash
psql postgres -c '\du'
```

## 11. 回滚

如果本次切换只想快速恢复服务，可以临时回退 SQLite：

```bash
export DATABASE_URL="sqlite:///./h5app.db"
```

然后重新 bootstrap 三个 `launchd` 服务。

注意：

- 这只适合你仍保留旧 SQLite 文件
- PostgreSQL 中的新数据不会自动同步回 SQLite

## 12. 最短命令清单

如果你只要最短可执行版本，按这个顺序跑：

```bash
brew install postgresql@16
brew services start postgresql@16
export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"

psql postgres -c "CREATE ROLE h5app LOGIN PASSWORD 'replace-this-password';"
psql postgres -c "CREATE DATABASE h5app OWNER h5app;"

cd /Users/ec2-user/h5-app/backend
source venv/bin/activate
pip install -r requirements.txt

export DATABASE_URL="postgresql+psycopg://h5app:replace-this-password@127.0.0.1:5432/h5app"
export SECRET_KEY="replace-with-random-secret"

python scripts/migrate_single_host_scheduler.py --database-url "$DATABASE_URL"

launchctl bootout gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.backend.plist
launchctl bootstrap gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.backend.plist

launchctl bootout gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.celery.plist
launchctl bootstrap gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.celery.plist

launchctl bootout gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.scheduler.plist
launchctl bootstrap gui/$(id -u) /Users/ec2-user/h5-app/backend/launchd/com.h5app.scheduler.plist

tail -n 100 /tmp/h5-app-backend.log
tail -n 100 /tmp/h5-app-celery.log
tail -n 100 /tmp/h5-app-scheduler.log
```
