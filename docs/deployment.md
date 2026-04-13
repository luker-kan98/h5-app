# 部署文档

> 当前这台机器在 2026-04-13 的实际运行状态见：
> [current-deployment-2026-04-13.md](/Users/ec2-user/h5-app/docs/current-deployment-2026-04-13.md)

## 架构概览

```
用户浏览器
    │
    ▼
Frontend (Nginx :5173)
    │  反向代理 /auth /build /builds /files
    ▼
Backend (FastAPI :8000)
    │  提交任务
    ▼
Redis (broker/result backend)
    │  消费任务
    ▼
Celery Worker
    │  调用构建工具
    ├── flutter build apk   → Android APK
    └── flutter build ios   → iOS .app (zip)
```

构建产物保存至 `BUILDS_DIR`，数据库使用 SQLite。

---

## 构建环境要求

| 平台 | 构建工具 |
|------|---------|
| Android | Flutter SDK + JDK 17 + Android SDK (cmdline-tools) |
| iOS | Flutter SDK + Xcode (仅 macOS) |
| macOS | Flutter SDK + electron-builder |
| Windows | electron-builder (仅 Windows) |

> iOS 构建必须在 macOS 宿主机上运行，无法在 Linux 容器内完成。

---

## 方式一：Docker Compose（推荐）

### 前置条件

- Docker 24+
- Docker Compose v2
- 宿主机已安装 Flutter SDK（Android/iOS 构建在宿主机执行，挂载进容器）

### 目录结构

```
h5-app/
├── backend/
├── frontend/
├── flutter-wrapper/      # 挂载至 /workspace/flutter-wrapper
├── electron-wrapper/     # 挂载至 /workspace/electron-wrapper
├── builds/               # 构建产物输出目录
└── docker-compose.yml
```

### 启动

```bash
# 1. 创建产物目录（首次）
mkdir -p builds && touch builds/.gitkeep

# 2. 设置必要的环境变量（修改 docker-compose.yml 或使用 .env 文件）
#    SECRET_KEY 必须替换为随机字符串
#    REPO_ROOT  指向包含 flutter-wrapper/electron-wrapper 的目录

# 3. 启动所有服务
docker-compose up --build -d

# 查看日志
docker-compose logs -f
```

### 环境变量

在 `docker-compose.yml` 或项目根目录 `.env` 文件中配置：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `SECRET_KEY` | `change-me-in-production` | JWT 签名密钥，**生产必须修改** |
| `DATABASE_URL` | `sqlite:////data/h5app.db` | SQLite 路径 |
| `CELERY_BROKER_URL` | `redis://redis:6379/0` | Redis broker 地址 |
| `CELERY_RESULT_BACKEND` | `redis://redis:6379/0` | Redis result backend 地址 |
| `BUILDS_DIR` | `/app/builds` | 构建产物存储目录 |
| `REPO_ROOT` | `/workspace` | flutter-wrapper/electron-wrapper 父目录 |

### 停止

```bash
docker-compose down          # 停止并移除容器，保留数据卷
docker-compose down -v       # 同时删除数据卷（会清除数据库）
```

---

## 方式二：本地开发部署

### 前置条件

- Python 3.12+
- Node.js 20+
- Redis（`brew install redis` 或 `apt install redis-server`）
- Flutter SDK（已加入 PATH）

### 启动步骤

```bash
# 1. 启动 Redis
redis-server &

# 2. 后端 API
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000 &

# 3. Celery Worker（新终端）
cd backend
source venv/bin/activate
celery -A app.tasks.build_task.celery_app worker --loglevel=info --concurrency=2 &

# 4. 前端（新终端）
cd frontend
npm install
npm run dev
```

访问：http://localhost:5173

### 环境变量（可选，有默认值）

```bash
export SECRET_KEY="your-secret-key"
export DATABASE_URL="sqlite:///./h5app.db"
export CELERY_BROKER_URL="redis://localhost:6379/0"
export CELERY_RESULT_BACKEND="redis://localhost:6379/0"
export BUILDS_DIR="./builds"
export REPO_ROOT="/path/to/h5-app"   # 包含 flutter-wrapper 的父目录
```

---

## Android 构建环境配置

Celery Worker 所在机器需要：

```bash
# 1. 安装 Flutter SDK
git clone https://github.com/flutter/flutter.git ~/flutter --depth 1 -b stable
export PATH="$PATH:$HOME/flutter/bin"
flutter doctor  # 检查环境

# 2. 安装 Android 命令行工具
# 下载 https://developer.android.com/studio#command-line-tools-only
mkdir -p ~/android-sdk/cmdline-tools
unzip commandlinetools-*.zip -d ~/android-sdk/cmdline-tools
mv ~/android-sdk/cmdline-tools/cmdline-tools ~/android-sdk/cmdline-tools/latest

export ANDROID_HOME=$HOME/android-sdk
export PATH="$PATH:$ANDROID_HOME/cmdline-tools/latest/bin"

# 3. 接受许可证并安装必要组件
yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0"

# 4. 验证
flutter doctor -v
```

### 默认 Keystore

`flutter-wrapper/android/app/default.jks` 为开发用默认签名证书：

| 属性 | 值 |
|------|----|
| 别名 (alias) | `h5packager` |
| 密码 (store/key password) | `changeit` |

**生产环境**建议通过 API 上传自定义 keystore，或替换环境变量：

```bash
export KEYSTORE_PATH=/path/to/release.jks
export KEYSTORE_PASSWORD=your-store-password
export KEY_ALIAS=your-key-alias
export KEY_PASSWORD=your-key-password
```

---

## iOS 构建环境配置

**必须在 macOS 上运行**，无法容器化。

```bash
# 1. 安装 Xcode（App Store 或 xcode-select）
xcode-select --install
sudo xcodebuild -license accept

# 2. 安装 CocoaPods
sudo gem install cocoapods

# 3. 验证
flutter doctor -v
```

iOS 输出为未签名的 `Runner.app`（zip 压缩），需在 Xcode 或 Fastlane 中完成签名后方可分发。

---

## API 接口概览

所有接口（除注册/登录外）需携带 `Authorization: Bearer <token>` 请求头。

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/auth/register` | 注册用户，返回 JWT |
| POST | `/auth/login` | 登录，返回 JWT |
| POST | `/build` | 提交打包任务（multipart/form-data）|
| GET | `/build/{task_id}` | 查询构建状态 |
| GET | `/builds/history` | 查询历史记录 |
| GET | `/files/{task_id}/{filename}` | 下载构建产物 |

### 提交构建示例

```bash
# 注册并获取 token
TOKEN=$(curl -s -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"yourpassword"}' | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")

# 提交 Android 构建
curl -X POST http://localhost:8000/build \
  -H "Authorization: Bearer $TOKEN" \
  -F "h5_url=https://your-h5-app.com" \
  -F "platforms=android"

# 提交双平台构建（带自定义 keystore）
curl -X POST http://localhost:8000/build \
  -H "Authorization: Bearer $TOKEN" \
  -F "h5_url=https://your-h5-app.com" \
  -F "platforms=android" \
  -F "platforms=ios" \
  -F "keystore_file=@/path/to/release.jks" \
  -F "keystore_password=storepass" \
  -F "key_alias=myalias" \
  -F "key_password=keypass"

# 查询状态
curl http://localhost:8000/build/{task_id} \
  -H "Authorization: Bearer $TOKEN"

# 下载产物
curl -O http://localhost:8000/files/{task_id}/android.apk \
  -H "Authorization: Bearer $TOKEN"
```

---

## 运行测试

```bash
cd backend
source venv/bin/activate
python -m pytest tests/ -v
```

---

## 生产注意事项

1. **修改 `SECRET_KEY`**：使用 `openssl rand -hex 32` 生成随机密钥
2. **HTTPS**：在 Nginx 前置层配置 TLS 证书（如 Let's Encrypt）
3. **并发控制**：根据服务器 CPU 核心数调整 `--concurrency`（Android 构建每次约 2–5 分钟，iOS 约 1–3 分钟）
4. **磁盘清理**：`BUILDS_DIR` 会积累产物，建议定期清理或设置保留策略
5. **SQLite 限制**：高并发场景建议迁移至 PostgreSQL，修改 `DATABASE_URL` 即可
