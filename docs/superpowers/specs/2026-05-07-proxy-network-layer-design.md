# H5 App Proxy Network Layer — Design

**Date:** 2026-05-07
**Scope:** Add a proxy/DNS network layer to packaged H5 WebView apps so they can reach H5 sites through Shadowsocks nodes, with cloud-updated node pools and DoH-based fallback discovery.
**Platforms (this iteration):** Android, macOS, Windows. **iOS deferred.**

---

## 1. Problem

The H5-to-native packager produces apps that today connect to the H5 URL directly. In restricted-network environments the H5 site may be unreachable, the local DNS may be poisoned, and the user cannot configure a proxy. We want the packager to optionally inject a built-in proxy runtime so the WebView traffic transits a Shadowsocks node, with multiple node-discovery sources and automatic failover.

The user-facing config form (image reference) collects:

| Field | Purpose |
|------|---------|
| OSS 地址 (one per line) | URLs returning a JSON node list, refreshed periodically |
| 云端更新间隔 (hours) | Refresh interval for OSS / DNS TXT |
| DNS TXT 域名 (one per line) | Domains whose TXT records contain SS URI nodes (queried via DoH) |
| 内建代理 (one per line) | Compile-time built-in nodes in Clash YAML or strict-JSON |
| 禁用直连 (checkbox) | If true, never fall back to direct connection |

## 2. Goals & Non-Goals

### Goals
- Inject a Shadowsocks-capable proxy runtime into Android (Flutter) and macOS / Windows (Electron) builds, only when the operator enables the new "proxy" SDK.
- Honor priority-ordered failover: built-in → OSS → DNS TXT.
- Refresh the node pool on a user-defined interval and re-probe if the active node breaks.
- Keep packaging build sizes bounded and avoid impacting builds that do **not** enable proxy (no extra binaries, no behavior change).

### Non-Goals
- iOS support (planned for a later iteration; WKWebView lacks an official proxy API and Network Extension entitlement is out of scope).
- VPN-level / system-wide tunneling (only WebView traffic transits the proxy; native SDKs and the OS itself are not proxied).
- In-app node picker UI (failover is automatic; user-visible UI is limited to an inline error page when all nodes fail).
- Protocols other than Shadowsocks in this iteration (the parser and `ProxyNode.type` field are designed to extend).
- Hot config swap without sing-box restart (config changes restart the supervised process).

## 3. High-Level Architecture

```
┌─────────────────────── Packaged H5 App ───────────────────────┐
│                                                                 │
│  ┌────────────┐         ┌─────────────────┐                    │
│  │  WebView   │◄────────│ Proxy Runtime   │                    │
│  │ (Flutter / │  http / │  (Dart / Node)  │                    │
│  │  Electron) │  socks5 └────────┬────────┘                    │
│  └────────────┘                  │ spawn / writeConfig         │
│        │                         ▼                              │
│        │                ┌─────────────────┐                    │
│        │                │   sing-box      │                    │
│        │                │   (binary)      │ socks5 :1080       │
│        │                │                 │ http   :1081       │
│        │                └────────┬────────┘                    │
│        ▼                         ▼                              │
│   ┌────────────────────────────────────┐                       │
│   │     SOCKS5 / HTTP → SS outbound    │                       │
│   └──────────┬─────────────────────────┘                       │
└──────────────┼─────────────────────────────────────────────────┘
               ▼
       remote SS server
```

Three subsystems live inside Proxy Runtime:

1. **Node Pool** — In-memory list of `ProxyNode`. Bootstrapped from built-in (compile-time) nodes; augmented by OSS fetch and DoH-based DNS TXT queries; refreshed on a timer.
2. **Probe & Selector** — Walks the pool in priority order, points sing-box at one node, performs a `HEAD` on the H5 URL through the proxy, accepts the first node whose probe returns 2xx/3xx.
3. **sing-box Supervisor** — Owns the sing-box subprocess. Writes config, spawns, restarts on crash (≤3 times/min), kills on app exit.

WebView wiring differs by platform but always points at the local sing-box inbound:

- **Android** uses HTTP inbound `127.0.0.1:1081` via `androidx.webkit.ProxyController.setProxyOverride()` (called from a Kotlin plugin before any `WebViewController` is created). `webview_flutter`'s default WebView lacks SOCKS5 support.
- **Electron** uses SOCKS5 inbound `127.0.0.1:1080` via `session.defaultSession.setProxy({ proxyRules: 'socks5://127.0.0.1:1080' })`.

`webview_flutter ^4.10.0` is preserved unchanged on Android — no `flutter_inappwebview` migration.

## 4. Data Model

### 4.1 Internal `ProxyNode`

Identical schema in Python (backend), Dart (Android runtime), JS (Electron runtime). Backend normalizes; runtimes only deserialize.

```python
@dataclass
class ProxyNode:
    name: str
    type: str                # "ss" only this iteration; field reserved for extension
    server: str
    port: int                # 1..65535
    cipher: str              # whitelisted SS ciphers
    password: str
    udp: bool = False
```

The validator rejects any `type` other than `"ss"` for now. The field is `str` rather than `Literal["ss"]` so future protocols (Trojan / VMess) can be added by widening the validator without touching the schema.

Cipher whitelist (sing-box-supported AEAD ciphers): `aes-128-gcm`, `aes-192-gcm`, `aes-256-gcm`, `chacha20-ietf-poly1305`, `xchacha20-ietf-poly1305`, `2022-blake3-aes-128-gcm`, `2022-blake3-aes-256-gcm`, `2022-blake3-chacha20-poly1305`.

### 4.2 Accepted input formats

Per-line input. Backend autodetects:

1. Starts with `ss://` → SS URI parser (base64 standard or url-safe; `#fragment` becomes `name`).
2. Starts with `{` → try strict JSON; if that fails, try YAML (`PyYAML.safe_load`) for Clash inline-mapping style.
3. Otherwise → reject with `"line N: cannot parse"`.

### 4.3 OSS JSON schema

```json
{
  "version": 1,
  "updated_at": "2026-05-07T00:00:00Z",
  "proxies": [
    { "name": "hk-1", "type": "ss", "server": "...", "port": 8388,
      "cipher": "aes-256-gcm", "password": "...", "udp": true }
  ]
}
```

Validated at runtime on each refresh (failures logged; the previous pool is retained).

### 4.4 DNS TXT schema

Each TXT string is one SS URI. Multiple TXT records on the same domain → multiple nodes.

```
example.com. IN TXT "ss://YWVzLTI1Ni1nY206cGFzc3dk@1.2.3.4:8388#fallback-hk"
```

Queried via DoH GET `https://1.1.1.1/dns-query?name=...&type=TXT` with `Accept: application/dns-json`.

### 4.5 Stored proxy config (post-normalization)

The injector writes a single JSON blob into the wrapper's generated config:

```json
{
  "ossUrls": ["https://example.com/config.json"],
  "updateIntervalHours": 1,
  "dnsTxtDomains": ["fallback.example.com"],
  "builtinProxies": [
    { "name": "hk", "type": "ss", "server": "...", "port": 31870,
      "cipher": "aes-256-gcm", "password": "...", "udp": true }
  ],
  "disableDirect": true
}
```

`builtinProxies` is **already a parsed array** — the runtime never sees raw user text.

## 5. Backend — SDK Catalog Extension

### 5.1 `SdkField` widget extension

`backend/app/services/sdk_catalog.py`:

```python
@dataclass(frozen=True)
class SdkField:
    name: str
    label_en: str
    label_zh: str
    required: bool = True
    secret: bool = False
    platforms: tuple[str, ...] = ()
    widget: str = "text"               # text | textarea | number | checkbox
    placeholder: str | None = None
    help_zh: str | None = None
```

All defaults are backward-compatible. Existing Sentry / Umeng / JPush / Firebase definitions need no changes.

`VALID_CATEGORIES` adds `"network"`.

`SDK_CONFIGS_MAX_BYTES` is raised from 10 KB to **50 KB** (Clash subscriptions with dozens of nodes can exceed 10 KB).

### 5.2 Proxy SDK definition

```python
"proxy": SdkDefinition(
    id="proxy",
    name_en="Network Proxy",
    name_zh="网络代理",
    category="network",
    supported_platforms=("android", "macos", "windows"),
    fields=(
        SdkField(name="ossUrls", label_en="OSS Config URLs",
                 label_zh="OSS 地址", help_zh="(一行一个)",
                 required=False, widget="textarea",
                 placeholder="https://example.com/config.json"),
        SdkField(name="updateIntervalHours",
                 label_en="Cloud Update Interval (hours)",
                 label_zh="云端更新间隔", help_zh="(小时)",
                 required=False, widget="number", placeholder="1"),
        SdkField(name="dnsTxtDomains", label_en="DNS TXT Domains",
                 label_zh="DNS TXT 域名", help_zh="(一行一个)",
                 required=False, widget="textarea"),
        SdkField(name="builtinProxies", label_en="Built-in Proxies",
                 label_zh="内建代理",
                 help_zh="(一行一个,Clash 节点格式或 JSON)",
                 required=False, widget="textarea", secret=True,
                 placeholder="{ name: 'hk', type: ss, server: ..., "
                             "port: ..., cipher: ..., password: ... }"),
        SdkField(name="disableDirect",
                 label_en="Disable Direct Connection",
                 label_zh="禁用直连",
                 required=False, widget="checkbox"),
    ),
)
```

### 5.3 Validation rules

`validate_sdk_configs` recognizes `proxy` and applies extra checks:

- At least one of `ossUrls` / `dnsTxtDomains` / `builtinProxies` must be non-empty after trimming.
- `updateIntervalHours` defaults to `1`; range `[0.1, 168]`.
- `disableDirect` accepted as `"true"` / `"false"` strings, normalized to bool.
- `ossUrls` and `dnsTxtDomains`: split on newlines, trim, drop empty lines, validate each URL/domain shape (URLs: `https?://`; domains: simple FQDN regex).
- `builtinProxies`: split on newlines, parse each line via the format-autodetect parser, validate against `ProxyNode` (port range, cipher whitelist, non-empty password, etc.). Errors include the 1-based line number.
- Selecting iOS together with proxy SDK → reject (`supported_platforms` does not include ios).

After validation the cleaned dict for `proxy` carries the post-normalization shape from §4.5 — runtimes never re-parse user text.

### 5.4 New module: `backend/app/services/proxy_node_parser.py`

Single source of truth for parsing one line into a `ProxyNode`. Used by:
- `validate_sdk_configs` for `builtinProxies`.
- `sdk_injector` indirectly (already-validated data).
- An OSS `proxies[]` entry validator (same shape check, but input is dict not text).

Public API:
- `parse_node_line(line: str) -> ProxyNode` (raises `SdkValidationError`)
- `validate_node_dict(d: dict) -> ProxyNode` (for OSS / TXT-derived dicts)
- `parse_ss_uri(uri: str) -> ProxyNode`

### 5.5 Injector changes

`backend/app/services/sdk_injector.py`:

#### `apply_flutter`
- If proxy enabled: extend the generated `lib/sdk_config.dart` with a third constant:
  ```dart
  const String proxyConfigJson = "{...post-normalization JSON from §4.5...}";
  ```
- If proxy disabled: the constant is `""` (the runtime treats empty as "feature off").
- Copy sing-box ABIs from `backend/vendor/singbox/android/<abi>/sing-box` into `flutter-wrapper/android/app/src/main/jniLibs/<abi>/libsingbox.so`, for `arm64-v8a`, `armeabi-v7a`, `x86_64`. The `lib*.so` rename is required for Android to package the binary into `nativeLibraryDir`.

#### `apply_electron`
- Pre-process `sdkConfigs.proxy` exactly like above (split, parse, normalize) and substitute the structured object into the existing `__SDK_CONFIGS__` placeholder. No new placeholder is introduced.
- Copy `sing-box-darwin` (mac) or `sing-box.exe` (win) from `backend/vendor/singbox/<platform>/` into the per-build copy of `electron-wrapper/resources/singbox/`.
- The wrapper's `package.json` declares `extraResources: [{ from: "resources/singbox", to: "singbox" }]` once (committed to the repo). When proxy is disabled the source folder is empty for that build, so `extraResources` collects nothing and the produced installer carries no sing-box payload.

#### Vendor binary management
- `backend/vendor/singbox/` is **gitignored** except for `README.md` and `fetch.sh`.
- `fetch.sh` downloads pinned sing-box releases (current target: a specific tagged release; pinned in the script) for: `android/{arm64-v8a,armeabi-v7a,x86_64}`, `darwin/{amd64,arm64}` (universal binary preferred), `windows/amd64`.
- Build host runs `fetch.sh` once during environment setup; CI ditto.

## 6. Frontend — `SdkConfigSection.vue` Widget Renderer

Switch the existing `<input>` block to render based on `field.widget`:

| widget | Renders | Bound value |
|--------|---------|-------------|
| `text` (default) | `<input type="text" / "password">` | string |
| `textarea` | `<textarea rows="4">` | string (multi-line) |
| `number` | `<input type="number" min="0">` | string-coerced number |
| `checkbox` | `<input type="checkbox">` | `"true"` / `"false"` |

`payload` builder unchanged — values stay as `Record<string, string>` over the wire; backend interprets per `widget` definition.

`help_zh` and `placeholder` fields render as visible hints (small grey text after the label / inside the input).

The SDK group header shows `name_zh / name_en · category` exactly like other SDKs. Proxy displays the "Not supported on: ios" notice via the existing `unsupportedFor()` logic when iOS is in `selectedPlatforms`.

## 7. Runtime Implementation

### 7.1 Common control flow

```
read proxyConfigJson  →  enabled?
  ↓ yes                    ↓ no
NodePool.bootstrap()       skip ProxyRuntime entirely; load WebView directly
  · built-in immediate
  · OSS URLs (parallel, 5s timeout, failure non-fatal)
  · DNS TXT via DoH (parallel, 5s timeout, failure non-fatal)
  ↓
nodes = [...builtin, ...oss, ...txt]
  ↓
ProbeSelector.pickFirstWorking(nodes, h5Url)
  · for each node:
    · supervisor.startWith(node)
    · HEAD h5Url through socks5/http (5s timeout)
    · 2xx/3xx → return node
  · all failed:
    · disableDirect=true → throw NoProxyAvailable
    · disableDirect=false → return null (future direct-fallback path; not exercised this iteration since D2 fixes disableDirect=true)
  ↓
configure WebView proxy
  · Android: WebViewProxyController.setHttpProxy('http://127.0.0.1:1081')
            (BEFORE creating WebViewController)
  · Electron: session.setProxy({ proxyRules: 'socks5://127.0.0.1:1080' })
  ↓
schedule refresh Timer (updateIntervalHours)
  · on tick: rerun bootstrap, merge into pool, re-probe only if current node failed
```

### 7.2 sing-box config template

Written to a temp file (`<app cache>/singbox-config.json`) and passed via `sing-box run -c <path>`:

```json
{
  "log": { "level": "warn", "disabled": false },
  "inbounds": [
    { "type": "socks", "tag": "socks-in",
      "listen": "127.0.0.1", "listen_port": 1080 },
    { "type": "http", "tag": "http-in",
      "listen": "127.0.0.1", "listen_port": 1081 }
  ],
  "outbounds": [
    { "type": "shadowsocks", "tag": "proxy-out",
      "server": "<node.server>", "server_port": <node.port>,
      "method": "<node.cipher>", "password": "<node.password>"
    }
  ]
}
```

Switching nodes = rewrite config file + kill + spawn (no hot reload this iteration).

### 7.3 Dart (Android) modules

Files under `flutter-wrapper/lib/proxy/`:

| File | Responsibility |
|------|----------------|
| `proxy_node.dart` | `ProxyNode` data class + `fromJson`. **No parser** — input is pre-normalized. |
| `node_pool.dart` | OSS fetch (`package:http`), DoH query, refresh timer, merge logic. |
| `singbox_supervisor.dart` | Spawns binary via `Process.start(applicationInfo.nativeLibraryDir + '/libsingbox.so', ['run', '-c', cfgPath])`. Restart policy ≤3/min. |
| `probe_selector.dart` | HEAD H5 URL through `http://127.0.0.1:1081` using `HttpClient.findProxy`. |
| `proxy_runtime.dart` | Orchestration. Singleton with `start(h5Url)` future. |
| `proxy_controller.dart` | MethodChannel client for the Kotlin plugin. |

Plus Kotlin side: `flutter-wrapper/android/app/src/main/kotlin/.../ProxyControllerPlugin.kt` (thin wrapper around `androidx.webkit.ProxyController.setProxyOverride()`). Registered in `MainActivity` before `runApp` is called.

`main.dart` integration:
```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  if (proxyConfigJson.isNotEmpty) {
    await ProxyRuntime.instance.start(_h5Url);  // includes setProxyOverride
  }
  runApp(const H5App());
}
```

`app/build.gradle` adds: `implementation "androidx.webkit:webkit:1.10.0"` (if not already present).

### 7.4 Node (Electron) modules

Files under `electron-wrapper/proxy/`:

| File | Responsibility |
|------|----------------|
| `proxy-node.js` | Plain object factory + JSON validator. |
| `node-pool.js` | OSS fetch (`https.get`), DoH query, refresh timer. |
| `singbox-supervisor.js` | `child_process.spawn(path.join(process.resourcesPath, 'singbox', binName))`. Restart policy ≤3/min. |
| `probe-selector.js` | HEAD via `socks-proxy-agent`. |
| `proxy-runtime.js` | Orchestration. |

`main.js` integration (in the existing `app.whenReady().then(...)` block, before `createWindow()`):
```js
const sdkConfigs = __SDK_CONFIGS__;
const proxyCfg = sdkConfigs?.proxy;
if (proxyCfg) {
  const ProxyRuntime = require('./proxy/proxy-runtime');
  await ProxyRuntime.start(proxyCfg, H5_URL);
  await session.defaultSession.setProxy({
    proxyRules: 'socks5://127.0.0.1:1080'
  });
}
createWindow();
```

`package.json` (electron wrapper) adds `socks-proxy-agent` dep + `extraResources` rule for `resources/singbox`.

### 7.5 Error UX

When all nodes fail and `disableDirect=true`, the runtime emits a `NoProxyAvailable` error. The wrapper renders an inline HTML error page:

- Android: `_controller.loadHtmlString(errorHtml)` instead of `loadRequest(_h5Url)`.
- Electron: `mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(errorHtml))`.

The HTML is a static template embedded in the wrapper (Chinese text "网络不可用，请检查代理配置"; a "重试" button calls `window.h5appBridge.postMessage('retryProxy')` on Android or `window.electronProxyRetry()` on Electron, both routed back into `ProxyRuntime.retry()`).

### 7.6 Lifecycle

| Event | Android | Electron |
|------|---------|----------|
| App launch | spawn sing-box | spawn sing-box |
| Background | keep alive | n/a |
| App exit | `WidgetsBindingObserver.didChangeAppLifecycleState(detached)` → kill | `app.on('before-quit')` → kill |
| sing-box crash | supervisor restarts (≤3 / min); after that → render error page | same |

## 8. Build Size Impact

| Platform | Increment when proxy enabled |
|---------|---------------------------|
| Android APK (split per ABI) | ~12 MB |
| macOS DMG | ~30 MB |
| Windows installer | ~30 MB |

Proxy disabled → 0 bytes added (binaries are skipped, generated `proxyConfigJson` is empty, `extraResources` source folder is empty).

## 9. Testing Strategy

### 9.1 Backend (`backend/tests/`)

| File | Coverage |
|------|---------|
| `test_sdk_catalog_widgets.py` | `SdkField` defaults; `catalog_as_dict` snapshot for existing SDKs unchanged; new fields surfaced. |
| `test_sdk_catalog_proxy.py` | proxy SDK exposed; supported_platforms = android/macos/windows; widget values per field. |
| `test_proxy_node_parser.py` | Clash YAML inline (quoted/unquoted), strict JSON, SS URI (std + url-safe + #fragment), error cases (port range, cipher whitelist, missing fields), mixed multiline. |
| `test_sdk_proxy_validation.py` | All-empty sources rejected; updateIntervalHours bounds; line-numbered parse errors; iOS+proxy rejected; checkbox boolification; multi-line URL/domain split. |
| `test_sdk_injector_proxy.py` | Generated `proxyConfigJson` shape; `builtinProxies` is array (not raw text); binaries copied only when enabled; correct ABI placement. Uses `tmp_path` and a fake `vendor/singbox/` tree. |

### 9.2 Dart (`flutter-wrapper/test/proxy/`)

| File | Coverage |
|------|---------|
| `node_pool_test.dart` | Built-in nodes immediately available; OSS mock client respects 5s timeout; failure of one source does not break pool; refresh timer ticks. |
| `probe_selector_test.dart` | First reachable node wins; all-fail + disableDirect=true throws; HEAD timeout. |
| `singbox_supervisor_test.dart` | Fake `Process` factory: config file written; ≤3 restarts / min; 4th failure throws `SupervisorGaveUpError`. |

No parser tests in Dart — input arrives pre-normalized.

OSS responses are still validated as `ProxyNode` shapes inside `node_pool_test.dart` (rejects malformed remote JSON; pool retains previous good state).

### 9.3 Node (`electron-wrapper/test/proxy/`)

`vitest` (added to `electron-wrapper/package.json` devDeps). Mirror of the Dart tests; uses `sinon` to stub `child_process.spawn` and `https.get`.

### 9.4 Manual smoke checklist (done at the end of implementation)

1. UI renders 5 fields (textarea / number / textarea / textarea / checkbox) with hints.
2. Submitting proxy SDK with no node sources returns "至少配置一个节点来源".
3. Android APK with proxy enabled is ~12 MB larger than baseline; on-device the H5 site loads, public-IP probe shows the node IP.
4. Killing the upstream node and relaunching the app shows the inline error page; "重试" button re-runs probe.
5. macOS DMG and Windows installer follow steps 3–4 with their respective binaries.
6. Editing OSS source nodes and waiting `updateIntervalHours` makes the app pick up the new pool (debug log visible).
7. Builds with proxy SDK NOT enabled produce installers/APKs unchanged from the pre-feature baseline (no sing-box payload, no proxy runtime code reachable; an empty `proxyConfigJson` constant is the only added byte in `lib/sdk_config.dart`).

## 10. Risks & Spike

Run a spike (1–2 hours) before writing the implementation plan to de-risk:

| Risk | Spike check |
|------|-------------|
| Android Gradle rejects `libsingbox.so` because it isn't actually a shared library | Embed binary, build APK, install on device, `Process.start` it, see PID + logs. |
| `androidx.webkit.ProxyController` unsupported on certain OEM WebViews | Test `WebViewFeature.isFeatureSupported(PROXY_OVERRIDE)` on Pixel + at least one Chinese OEM (Xiaomi/Huawei) device. |
| Electron `extraResources` + `child_process.spawn` does not survive notarize / signing flow | Build a signed (or ad-hoc-signed) `.app` and `.exe`, run from non-dev location, verify spawn. |

Failure of any spike step → return to brainstorming for a scope reduction (e.g., HTTP-proxy-only fallback) before plan-writing.

## 11. Out of Scope (Tracked, Not Done)

- iOS support
- VPN / system-wide proxy
- In-app node picker UI
- Latency-based smart selection
- Hot reload of sing-box config
- Protocols beyond Shadowsocks (Trojan / VMess / VLESS): the `ProxyNode.type` enum is wider than `Literal["ss"]` would suggest; extending it is straightforward, but not in this iteration.
