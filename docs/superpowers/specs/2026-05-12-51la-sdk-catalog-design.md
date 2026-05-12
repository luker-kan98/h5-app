# 51LA SDK — Catalog 内置可选 SDK 设计

**日期**: 2026-05-12
**作者**: luker
**状态**: 待实现

## 背景

打包器目前在 catalog 里提供 sentry / appvue / umeng / firebase / proxy 五个可选 SDK。新增 51LA（我要啦统计 v6）作为第六个可选项。

与已有四个 SDK 不同，**51LA 没有原生 Android/iOS SDK，只发布 JS SDK**（CDN：`https://sdk.51.la/js-sdk-pro.min.js`）。所有移动端/桌面端 H5 套壳都通过同一份 JS 接入即可。

## 目标

- 用户在 catalog 勾选 51LA + 填 MaskId → 打包出的 App 在 WebView 中自动加载 51LA 统计脚本并初始化。
- 4 端通吃（android / ios / macos / windows）。
- 零原生代码改动；复用现有 `customJs` 注入通路。

## 非目标

- 不做分平台 MaskId（用户已确认单 MaskId 即可）。
- 不做 51LA 与 OpenAPI 的服务端联调（OpenAPI 是 51LA 的另一条线，与打包无关）。
- 不做 51LA JS 注入失败的运行时反馈（51LA 自身无成功/失败回调，且统计 SDK 的失败对业务无致命影响）。

## 架构

### 注入路径

51LA 走**自动前置拼接到 `customJs`** 路线：

```
用户 sdk_configs.la51 = {maskId, autoTrack, hashMode}
        │
        ▼
apply_flutter / apply_electron
        │
        ├── _render_la51_snippet(cfg)  →  51LA 启动 JS 片段
        │
        ▼
final_custom_js = la51_snippet + "\n" + (user_custom_js or "")
        │
        ▼
写入 Dart 常量 customJs / Electron __CUSTOM_JS__ 占位符
        │
        ▼
WebView 的 onPageFinished / did-finish-load 钩子里 runJavaScript(customJs)
```

- 51LA 片段在用户 `custom_js` 之前执行（先初始化统计，再跑业务自定义 JS）。
- WebView/Electron 模板**不感知** 51LA — 对它们来说只是 customJs 变长了。

### 注入片段（DOM 注入，非 document.write）

```js
(function(){
  var s = document.createElement('script');
  s.charset = 'UTF-8';
  s.id = 'LA_COLLECT';
  s.src = 'https://sdk.51.la/js-sdk-pro.min.js';
  s.onload = function(){
    if (window.LA) LA.init({
      id: '<maskId>', ck: '<maskId>',
      autoTrack: <true|false>,
      hashMode: <true|false>
    });
  };
  document.head.appendChild(s);
})();
```

**为什么用 DOM 注入而不是 `document.write` 或 inline `<script src>` 标签：**
Flutter `runJavaScript` 和 Electron `executeJavaScript` 都在 `onPageFinished` 之后才执行；那时 HTML parser 已结束，`document.write` 会覆盖整页。DOM 注入是异步的，对已加载的页面安全。

### Catalog 定义

```python
"la51": SdkDefinition(
    id="la51",
    name_en="51LA Analytics",
    name_zh="51LA 网站统计",
    category="analytics",
    supported_platforms=("android", "ios", "macos", "windows"),
    fields=(
        SdkField(
            name="maskId",
            label_en="MaskId",
            label_zh="应用 MaskId",
            help_zh="(从 v6.51.la 应用管理页复制)",
        ),
        SdkField(
            name="autoTrack",
            label_en="Auto Event Tracking",
            label_zh="启用事件分析",
            required=False,
            widget="checkbox",
        ),
        SdkField(
            name="hashMode",
            label_en="SPA Hash Routing",
            label_zh="单页应用 Hash 路由统计",
            required=False,
            widget="checkbox",
        ),
    ),
),
```

`maskId` `secret=False`（公开标识符，类似 GA 的 measurement id）。

### MaskId 校验

51LA MaskId 实际样本为 `KrDopMys2nnwBDrx`（16 位 base62）。校验规则：

- 必填、非空。
- 正则：`^[A-Za-z0-9]{1,32}$`。
- 防御点：拒绝带 `'` `"` `\` `\n` `<` `>` 等会破坏拼出来的 JS 字面量的字符。

校验入口接到 `validate_sdk_configs` 现有的通用路径里（无需为 51LA 走类似 `_normalize_proxy` 的独立函数，但 maskId 字段做单独的正则校验）。

### Booleans 处理

`autoTrack` / `hashMode` 是 `widget="checkbox"`。前端可能以 `true/false`、`"true"/"false"`、`"on"/""` 等多种形式提交。在 `validate_sdk_configs` 里走通用的 `(str, int, float, bool)` 收口，然后在 `_render_la51_snippet` 入口做一次 `_to_bool` 归一化（沿用 `_normalize_proxy.disableDirect` 的写法），输出到 JS 字面量时强制是 `true` 或 `false`。

### 已注入的 sdkConfigsJson 处理

`la51` 子对象**从 sdkConfigsJson 常量中剥离**（跟 firebase 的 base64 文件剥离对齐）。原因：

- 已经物化为 JS 片段，再带一份明文是冗余。
- MaskId 虽然不敏感，但减小 Dart 常量大小是好处。

实现：在 `apply_flutter` / `apply_electron` 里 `copy.deepcopy(sdk_configs)`，再 `sanitized.pop("la51", None)` 后传给 `_render_dart_config` / `_render_electron_main`。

## 测试

backend 单元测试（`tests/test_sdk_injector.py` + `tests/test_build_sdk_api.py`）：

1. `test_sdk_catalog_endpoint` — `{la51} <= ids`
2. `test_apply_flutter_la51_injects_snippet` — 启用 51LA、user_custom_js=None → Dart 常量 `customJs` 含 `LA.init({id:'XXX',ck:'XXX',autoTrack:false,hashMode:false})`，且 `la51` 不在 `sdkConfigsJson`
3. `test_apply_flutter_la51_prepends_before_user_customjs` — 同时给 51LA + 自定义 customJs → 51LA 片段在前、用户 JS 在后
4. `test_apply_flutter_la51_options_render_as_bools` — `autoTrack=true, hashMode=true` → 片段中是 `autoTrack:true,hashMode:true`（不是字符串）
5. `test_apply_electron_la51_injects_snippet` — Electron 路径同 #2
6. `test_apply_electron_la51_strips_from_sdk_configs` — `__SDK_CONFIGS__` 占位符替换后的 JS 对象不含 `la51` 键
7. `test_apply_flutter_la51_disabled_noop` — 不在 sdk_configs 中传 51LA → Dart 常量 `customJs` 不含 `LA.init` 也不含 `51.la`
8. `test_validate_la51_maskid_required` — `la51: {}` → 校验失败
9. `test_validate_la51_maskid_format_rejects_special_chars` — `maskId: "abc';alert(1)"` → 校验失败
10. `test_validate_la51_maskid_format_accepts_real_sample` — `maskId: "KrDopMys2nnwBDrx"` → 校验通过

无需新增 Flutter / Electron 端测试（模板/常量无改动，行为已被现有 customJs 测试覆盖）。

## 不做的事

- 不动 Flutter `main.dart`
- 不动 Electron `main.js` 模板（除非 `__CUSTOM_JS__` 占位符的拼装逻辑需要调整，目前看不需要）
- 不引入 51LA Node OpenAPI SDK（与打包无关）
- 不分平台 MaskId（已确认）
- 不为 51LA 加 onLoad 失败重试 / 错误上报（统计 SDK 失败对业务无致命影响）

## 风险与权衡

| 风险 | 缓解 |
|---|---|
| 51LA CDN 不可达 → `onload` 不触发，统计无声丢失 | 不处理。统计 SDK 失败对业务功能无影响，加重试反而引入抖动。 |
| 用户 H5 页面有严格 CSP，禁止外部 script | 不处理。CSP 是用户站点选择，h5-app 文档里提一句即可。 |
| MaskId 注入到 JS 字面量被 XSS | 通过 `^[A-Za-z0-9]{1,32}$` 正则校验杜绝。 |
| customJs 50KB 上限被 51LA 片段占用 ~400 字节 | 不显著，无需调整上限。 |
