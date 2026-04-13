# H5 转多平台 App 打包平台 — 设计文档

**日期：** 2026-04-05
**状态：** 已确认

---

## 背景与目标

用户只需提交一个 H5 链接，平台自动将其打包成 Android、iOS、macOS、Windows 原生应用，并提供下载链接。

核心价值：无需用户修改 H5 源码，无需了解原生开发，一键完成 Web → Native 封装。

---

## 整体架构

**方案：Monorepo + 异步队列**

```
h5-app/
├── frontend/                    # Vue 3 + Vite + TypeScript + TailwindCSS
├── backend/                     # FastAPI + Celery + SQLite
├── capacitor-wrapper/           # Capacitor WebView 模板（Android + iOS）
├── electron-wrapper/            # Electron 模板（macOS + Windows）
├── builds/                      # 打包产物输出目录（gitignore）
└── docker-compose.yml           # Redis + backend + frontend + celery-worker 一键启动
```

---

## 目录结构详细

### frontend/
```
frontend/
├── src/
│   ├── views/
│   │   ├── LoginView.vue        # 登录/注册页
│   │   ├── HomeView.vue         # H5 链接输入 + 平台选择 + 提交
│   │   ├── TaskView.vue         # 打包进度轮询 + 下载链接
│   │   └── HistoryView.vue      # 历史打包记录
│   ├── composables/
│   │   ├── useAuth.ts           # JWT 登录/登出/刷新
│   │   └── useBuild.ts          # 提交打包、轮询状态
│   ├── stores/
│   │   └── auth.ts              # Pinia：用户认证状态
│   └── router/index.ts
└── package.json
```

### backend/
```
backend/
├── app/
│   ├── main.py                  # FastAPI 入口，挂载路由和静态文件
│   ├── api/
│   │   ├── auth.py              # POST /auth/register, POST /auth/login
│   │   └── build.py             # POST /build, GET /build/{task_id}, GET /builds/history
│   ├── tasks/
│   │   └── build_task.py        # Celery 任务：调用构建命令，管理产物
│   ├── models/
│   │   ├── user.py              # User 表（SQLAlchemy）
│   │   └── build_job.py         # BuildJob 表
│   └── services/
│       ├── auth_service.py      # JWT 生成/验证
│       └── file_service.py      # 文件路径管理、下载 URL 生成
├── celeryconfig.py
└── requirements.txt
```

### capacitor-wrapper/
```
capacitor-wrapper/
├── capacitor.config.ts          # server.url 由打包脚本动态注入
├── package.json
├── android/                     # Capacitor 生成的 Android 原生项目
├── ios/                         # Capacitor 生成的 iOS 原生项目
└── src/
    └── index.html               # 空壳页面（实际加载 server.url）
```

### electron-wrapper/
```
electron-wrapper/
├── package.json
├── main.js                      # Electron 主进程，读取 H5_URL 环境变量加载 WebView
└── preload.js
```

---

## 数据流

### 打包请求流程

```
用户 → POST /build { h5_url, platforms: [android, ios, macos, windows] }
         │
         ├── 验证 JWT
         ├── 创建 BuildJob（status=pending）
         ├── 推送 Celery 任务（task_id）
         └── 返回 { task_id }

Celery Worker（后台异步）：
  1. 更新 BuildJob status=running
  2. 为每个任务创建独立工作目录（避免并发竞争）：
     - 将 capacitor-wrapper/ 复制到 /tmp/build-<task_id>/capacitor/
     - 将 electron-wrapper/  复制到 /tmp/build-<task_id>/electron/
  3. 为每个选中平台串行构建：
     - Android: 修改副本的 capacitor.config.ts server.url → npx cap sync android → ./gradlew assembleRelease
     - iOS:     修改副本的 capacitor.config.ts server.url → npx cap sync ios → xcodebuild（需 Mac）
     - macOS:   以环境变量 H5_URL=<url> 运行 npm run build:mac（Electron 读取 process.env.H5_URL）
     - Windows: 以环境变量 H5_URL=<url> 运行 npm run build:win
  4. 将产物复制到 builds/<task_id>/，命名规范：
     - Android: android.apk
     - iOS:     ios.ipa（或 ios-unsigned.app）
     - macOS:   macos.dmg（或 macos.zip）
     - Windows: windows-setup.exe（或 windows.zip）
  5. 清理 /tmp/build-<task_id>/ 临时目录
  6. 更新 BuildJob status=done，写入各平台文件路径

  注：
  - Celery worker 并发数建议设为 2-4，每个任务内部串行构建各平台以控制资源占用
  - 必须设置任务超时：`soft_time_limit=1800`（30分钟）、`time_limit=2700`（45分钟），防止 Gradle/Xcode 挂起占用 worker
  - /tmp 临时目录清理必须在 `finally` 块中执行，确保任务失败时也能释放磁盘空间

用户轮询 → GET /build/{task_id}
  → { status, platforms: { android: { status, url }, ios: {...}, ... } }

下载 → GET /files/{task_id}/{filename}
  → FastAPI FileResponse
```

### 认证流程

```
POST /auth/login → 验证用户名/密码 → 返回 JWT（24h 有效）
前端存储 JWT → 后续请求 Authorization: Bearer <token>
```

---

## API 设计

| 方法 | 路径 | 认证 | 说明 |
|------|------|------|------|
| POST | `/auth/register` | 无 | 用户注册 |
| POST | `/auth/login` | 无 | 登录，返回 JWT |
| POST | `/build` | JWT | 提交打包任务 |
| GET | `/build/{task_id}` | JWT | 查询任务状态 + 下载链接 |
| GET | `/builds/history` | JWT | 当前用户历史任务 |
| GET | `/files/{task_id}/{filename}` | JWT | 文件下载 |

### POST /build 请求体
```json
{
  "h5_url": "https://example.com",
  "platforms": ["android", "ios", "macos", "windows"]
}
```

### GET /build/{task_id} 响应
```json
{
  "task_id": "abc123",
  "status": "running",
  "h5_url": "https://example.com",
  "created_at": "2026-04-05T10:00:00Z",
  "platforms": {
    "android": { "status": "done", "download_url": "/files/abc123/android.apk" },
    "ios":     { "status": "running", "download_url": null },
    "macos":   { "status": "pending", "download_url": null },
    "windows": { "status": "failed", "download_url": null, "error": "..." }
  }
}
```

---

## 数据模型

### User
```
id          INTEGER PRIMARY KEY
username    TEXT UNIQUE NOT NULL
password    TEXT NOT NULL  (bcrypt hash)
created_at  DATETIME
```

### BuildJob
```
id              INTEGER PRIMARY KEY
task_id         TEXT UNIQUE  (Celery task id)
user_id         INTEGER FK User
h5_url          TEXT NOT NULL
status          TEXT  (pending/running/done/failed)
requested_platforms  TEXT  (JSON: ["android","ios",...])  # 用户请求的平台列表
created_at      DATETIME
finished_at     DATETIME
# 各平台结果（路径+错误二选一）
android_path    TEXT NULLABLE
android_error   TEXT NULLABLE
ios_path        TEXT NULLABLE
ios_error       TEXT NULLABLE
macos_path      TEXT NULLABLE
macos_error     TEXT NULLABLE
windows_path    TEXT NULLABLE
windows_error   TEXT NULLABLE
```

注：`requested_platforms` 记录用户请求了哪些平台；各 `*_path` / `*_error` 字段记录各平台的最终结果，是权威来源。

---

## 前端页面设计

### HomeView
- URL 输入框（带格式校验）
- 平台多选（Android / iOS / macOS / Windows）
- 提交按钮 → 跳转 `/task/:id`

### TaskView
- 每 3 秒轮询 `GET /build/{task_id}`
- 各平台状态卡片（进度条 / 完成图标 / 错误提示）
- 完成平台显示下载按钮

### HistoryView
- 分页列表，显示历史任务的 URL、状态、创建时间、下载链接

---

## 构建环境说明

| 平台 | 构建环境要求 |
|------|-------------|
| Android | JDK + Android SDK + Gradle（Linux/Mac/Windows 均可） |
| iOS | **必须 macOS** + Xcode + Apple 开发者证书 |
| macOS | **必须 macOS** + Xcode Command Line Tools |
| Windows | **必须 Windows** + Visual Studio Build Tools |

**部署建议：** 初期在 Mac 上部署可同时支持 Android + iOS + macOS；Windows 构建需单独 Windows 服务器或 CI。

---

## 关键设计决策

### JWT 存储位置
前端将 JWT 存储在 `localStorage`（Vue SPA 标准做法）。注意：生产环境需配合 XSS 防护（CSP headers）。

### Capacitor Wrapper 初始化
`capacitor-wrapper/android/` 和 `ios/` 目录需预先执行 `npx cap init && npx cap add android && npx cap add ios` 生成，并**提交到仓库**。每次打包时复制整个目录到临时路径。

### Electron H5_URL 注入
Electron 通过 `process.env.H5_URL` 读取 URL（不修改源文件），打包命令：
```bash
H5_URL="https://example.com" npm run build:mac
```
`electron-wrapper/main.js` 中：
```js
const url = process.env.H5_URL || 'https://example.com'
mainWindow.loadURL(url)
```

### h5_url 后端校验
提交打包前验证：
1. URL scheme 必须为 `http` 或 `https`
2. 不允许 `localhost`、`127.0.0.1`、内网 IP（防止 SSRF）
3. URL 格式合法性（正则或 Python `urllib.parse`）

### iOS 构建限制（v1）
iOS 构建产出未签名的 `.app` 包，仅供开发者本地测试（需 Xcode 手动签名或 TestFlight）。下载链接和页面上明确标注此限制。

## 技术栈汇总

| 层 | 技术 |
|----|------|
| 前端 | Vue 3 + Vite + TypeScript + Pinia + TailwindCSS |
| 后端 API | FastAPI + SQLAlchemy + SQLite |
| 任务队列 | Celery + Redis |
| 认证 | JWT（python-jose + passlib/bcrypt） |
| 移动端打包 | Capacitor（Android + iOS） |
| 桌面端打包 | Electron（macOS + Windows） |
| 部署 | Docker Compose（4个服务：redis, backend, frontend, celery-worker） |

---

## 验证方案

1. **本地端到端测试：**
   - 启动 `docker-compose up`（Redis + backend + frontend）
   - 注册用户，登录获取 JWT
   - 提交一个公开 H5 URL，选择 Android 平台
   - 轮询任务状态直到 done
   - 下载 APK，安装到模拟器验证能打开

2. **单元测试：**
   - FastAPI 路由测试（pytest + httpx）
   - Celery 任务 mock 测试

3. **构建验证：**
   - 手动执行 `npx cap sync android && ./gradlew assembleRelease` 验证 Capacitor wrapper
   - 手动执行 Electron `npm run build` 验证桌面端

---

## 不在范围内（初版）

- iOS/macOS/Windows 代码签名自动化
- SDK 植入（友盟统计、推送等）
- 付费/限流机制
- 自定义 App 图标、名称（初版固定）
