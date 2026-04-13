# Flutter Wrapper 替换 Capacitor 设计文档

**日期**: 2026-04-07
**范围**: 用 Flutter WebView 方案替换现有 `capacitor-wrapper/`，支持 Android/iOS 跨平台打包，Android 输出签名 APK

---

## 背景

现有 `capacitor-wrapper/` 使用 Capacitor 方案，依赖 Node.js + Android SDK + CocoaPods 三套工具链，结构复杂且维护成本高。目标是用 Flutter 替换，简化模板结构，同时利用 Flutter 插件生态为未来扩展原生能力打基础。

---

## 目标

- Android：输出签名 `.apk`（release）
- iOS：输出未签名 `.app`（zip 打包，暂缓签名，后续迭代）
- H5 URL 通过 `--dart-define=H5_URL=xxx` 编译时注入
- 支持平台默认签名 + 用户自定义签名（Android）

---

## 环境要求

| 平台 | 要求 |
|------|------|
| Android | Flutter SDK（需在 `PATH`）+ Android SDK + JDK |
| iOS | macOS + Xcode + Xcode Command Line Tools + Flutter SDK（需在 `PATH`）|

Flutter 必须对 Celery worker 进程可见（Docker 镜像或宿主机 `PATH` 中包含 Flutter bin 目录）。

---

## Flutter Wrapper 模板结构

```
flutter-wrapper/
├── pubspec.yaml              # 依赖：webview_flutter
├── pubspec.lock              # 必须提交到 repo，确保依赖版本固定
├── lib/
│   └── main.dart             # 唯一入口：读取 H5_URL，启动 WebView
├── android/
│   ├── app/
│   │   ├── build.gradle      # 签名配置（读取环境变量，含 signingConfigs）
│   │   ├── default.jks       # 平台内置默认 keystore（提交到 repo）
│   │   └── src/main/
│   │       └── AndroidManifest.xml
│   └── build.gradle
└── ios/
    └── Runner/               # Flutter 默认 iOS 结构，scheme 名称固定为 Runner
```

### main.dart 核心逻辑

```dart
const h5Url = String.fromEnvironment('H5_URL', defaultValue: 'about:blank');
// WebViewWidget 加载 h5Url
```

### android/app/build.gradle 签名配置

```groovy
android {
    signingConfigs {
        release {
            storeFile file(System.getenv("KEYSTORE_PATH") ?: "${projectDir}/default.jks")
            storePassword System.getenv("KEYSTORE_PASSWORD") ?: "changeit"
            keyAlias System.getenv("KEY_ALIAS") ?: "h5packager"
            keyPassword System.getenv("KEY_PASSWORD") ?: "changeit"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

`storeFile` 使用绝对路径（通过 `KEYSTORE_PATH` 环境变量传入），或回退到 `default.jks`（相对于 Gradle 项目根）。

### Android 签名环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `KEYSTORE_PATH` | `.jks` 文件绝对路径 | 回退到 `build.gradle` 中的 `${projectDir}/default.jks` |
| `KEYSTORE_PASSWORD` | keystore 密码 | `changeit` |
| `KEY_ALIAS` | key alias | `h5packager` |
| `KEY_PASSWORD` | key 密码 | `changeit` |

---

## Backend 改动

### build_task.py — 路径常量

```python
# 删除
CAPACITOR_WRAPPER_SRC = ...

# 新增
FLUTTER_WRAPPER_SRC = os.path.join(REPO_ROOT, "flutter-wrapper")
```

### build_task.py — _build_android 重写

```python
def _build_android(h5_url, flutter_dir, _ele_dir):
    env = {**os.environ}
    # 如果调用方通过环境变量注入了自定义 keystore 路径，直接透传即可
    # KEYSTORE_PATH 必须是绝对路径
    _run(
        ["flutter", "build", "apk", "--release", f"--dart-define=H5_URL={h5_url}"],
        cwd=flutter_dir,
        env=env,
    )
    return os.path.join(flutter_dir, "build/app/outputs/flutter-apk/app-release.apk")
```

### build_task.py — _build_ios 重写

```python
def _build_ios(h5_url, flutter_dir, _ele_dir):
    _run(
        ["flutter", "build", "ios", "--release", "--no-codesign",
         f"--dart-define=H5_URL={h5_url}"],
        cwd=flutter_dir,
    )
    # scheme 名称固定为 Runner（Flutter 默认，不得在模板中修改）
    return os.path.join(flutter_dir, "build/ios/iphoneos/Runner.app")
```

iOS 产物为目录（`.app` bundle），`build_app` 中现有的目录 zip 逻辑（`shutil.make_archive`）保持不变，无需修改。

### build_task.py — build_app 主流程调整

```python
# 删除 cap_tmp 相关代码，替换为：
flutter_tmp = os.path.join(tmp_dir, "flutter")

def ignore_flutter_artifacts(src, names):
    return [n for n in names if n in {".dart_tool", "build", ".flutter-plugins", ".flutter-plugins-dependencies"}]

shutil.copytree(FLUTTER_WRAPPER_SRC, flutter_tmp, ignore=ignore_flutter_artifacts)
_run(["flutter", "pub", "get"], cwd=flutter_tmp)  # 使用 _run() 保持错误格式统一

# electron_tmp 保持不变
# builder 调用由 builder(h5_url, cap_tmp, ele_tmp) 改为 builder(h5_url, flutter_tmp, ele_tmp)
```

`_build_macos` 和 `_build_windows` 签名保持不变（第二个参数为 `_cap_dir`，改名为 `_flutter_dir`，值为 `flutter_tmp`，这两个平台不使用它）。

### build_task.py — 删除内容

- `_inject_capacitor_url` 函数
- `_IOS_ENV`（CocoaPods gem 环境变量）
- `ignore_node_modules` 函数（替换为 `ignore_flutter_artifacts`）
- `CAPACITOR_WRAPPER_SRC` 常量

---

## 签名密钥管理

### 优先级（从高到低）

1. 用户本次任务上传的自定义 keystore（临时，经由任务参数传递）
2. 系统环境变量（运维统一配置 `KEYSTORE_PATH` 等）
3. `build.gradle` 中的默认 `default.jks`

### 用户自定义签名流程（生命周期）

由于 Celery worker 在独立进程中运行，`tmp_dir` 在任务启动时才创建，因此自定义 keystore 必须在派发任务前保存到一个已知路径，再将路径作为任务参数传入。

1. **Router** (`routers/build.py`) 接收 `multipart/form-data` 请求，解析可选的 `keystore_file` 字段
2. Router 将 keystore 文件保存到 `BUILDS_DIR/<job_id>/custom.jks`（绝对路径）
3. Router 调用 `build_app.delay(job_id, h5_url, platforms, keystore_params)`，其中 `keystore_params` 为 `{"path": "/abs/path/custom.jks", "password": ..., "alias": ..., "key_password": ...}` 或 `None`
4. Celery task 收到 `keystore_params` 后，将其写入 `env` 再传入 `_build_android`
5. 构建完成后，task 的 `finally` 块显式删除 `custom.jks`：
   ```python
   if keystore_params:
       custom_ks = keystore_params.get("path")
       if custom_ks and os.path.exists(custom_ks):
           os.remove(custom_ks)
   ```

### routers/build.py 改动

- 请求体从 Pydantic JSON model 改为 FastAPI `File` + `Form` 参数
- 新增可选字段：`keystore_file: UploadFile = File(None)`、`keystore_password: str = Form(None)`、`key_alias: str = Form(None)`、`key_password: str = Form(None)`
- `build_app.delay(...)` 新增 `keystore_params` 参数

---

## 不在本次范围内

- iOS 签名（后续迭代）
- Android `.aab` 输出（后续迭代）
- 用户证书持久化存储
- Electron npm install 优化（预存在的低效，不在本次范围）
