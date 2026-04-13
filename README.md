# H5 App Packager

一键将 H5 链接打包成 Android / iOS / macOS / Windows 原生应用。

## 架构

- **frontend/** — Vue 3 + Vite + TailwindCSS 前端
- **backend/** — FastAPI + Celery + SQLite 后端
- **flutter-wrapper/** — Flutter WebView 模板（Android + iOS）
- **electron-wrapper/** — Electron 模板（macOS + Windows）

## 快速启动

### 本地开发（需要 Redis）

```bash
# 启动 Redis
redis-server &

# 后端
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload &

# Celery Worker
celery -A app.tasks.build_task.celery_app worker --loglevel=info &

# 前端
cd ../frontend
npm install && npm run dev
```

### Docker Compose

```bash
docker-compose up --build
```

访问 http://localhost:5173

## 构建环境要求

| 平台 | 构建环境 |
|------|---------|
| Android | JDK + Android SDK + Gradle |
| iOS | macOS + Xcode |
| macOS | macOS + electron-builder |
| Windows | Windows + electron-builder |

## 运行测试

```bash
cd backend
python -m pytest tests/ -v
```
