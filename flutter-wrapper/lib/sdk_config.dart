// Default SDK config — overwritten by the build pipeline (sdk_config.generated.dart).
// When no generated file is present (local dev, tests), these defaults are used.
const String customJs = "";
const String sdkConfigsJson = "{}";
// Empty string means the proxy SDK was not enabled for this build; the runtime
// skips its bootstrap and the WebView loads the H5 URL directly.
const String proxyConfigJson = "";
