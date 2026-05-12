import 'dart:convert';
import 'dart:io' show Platform;

import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'appvue_plugin.dart';
import 'proxy/domain_resolver.dart';
import 'proxy/error_page.dart';
import 'proxy/file_logger.dart';
import 'proxy/proxy_runtime.dart';
import 'firebase_bridge.dart';
import 'sdk_bridge.dart';
import 'sdk_config.dart' as sdk_config;
import 'sentry_bridge.dart';
import 'umeng_bridge.dart';

const String _h5Url = String.fromEnvironment('H5_URL', defaultValue: 'about:blank');

Map<String, dynamic>? _parseProxyConfig() {
  const raw = sdk_config.proxyConfigJson;
  if (raw.isEmpty) return null;
  try {
    return jsonDecode(raw) as Map<String, dynamic>;
  } catch (_) {
    return null;
  }
}

String? _parseSentryDsn() {
  const raw = sdk_config.sdkConfigsJson;
  if (raw.isEmpty) return null;
  try {
    final decoded = jsonDecode(raw);
    if (decoded is! Map<String, dynamic>) return null;
    final sentry = decoded['sentry'];
    if (sentry is! Map) return null;
    final dsn = sentry['dsn'];
    if (dsn is! String || dsn.isEmpty) return null;
    return dsn;
  } catch (_) {
    return null;
  }
}

class _UmengConfig {
  final String appKey;
  final String? channel;
  const _UmengConfig(this.appKey, this.channel);
}

_UmengConfig? _parseUmengConfig() {
  const raw = sdk_config.sdkConfigsJson;
  if (raw.isEmpty) return null;
  try {
    final decoded = jsonDecode(raw);
    if (decoded is! Map<String, dynamic>) return null;
    final umeng = decoded['umeng'];
    if (umeng is! Map) return null;
    final keyField = Platform.isIOS ? 'iosAppKey' : 'androidAppKey';
    final appKey = umeng[keyField];
    if (appKey is! String || appKey.isEmpty) return null;
    final channel = umeng['channel'];
    return _UmengConfig(
      appKey,
      channel is String && channel.isNotEmpty ? channel : null,
    );
  } catch (_) {
    return null;
  }
}

bool _hasFirebaseConfig() {
  // Backend strips the base64 file blobs from sdkConfigsJson after writing
  // them to disk, so the firebase namespace may be present with an empty
  // object — that still means the user enabled Firebase. Treat any firebase
  // map (even {}) as "try to init", and let the native side return false
  // when the SDK isn't actually linked into the build.
  const raw = sdk_config.sdkConfigsJson;
  if (raw.isEmpty) return false;
  try {
    final decoded = jsonDecode(raw);
    return decoded is Map<String, dynamic> && decoded.containsKey('firebase');
  } catch (_) {
    return false;
  }
}

bool _hasAppVueConfig() {
  const raw = sdk_config.sdkConfigsJson;
  if (raw.isEmpty) return false;
  try {
    final decoded = jsonDecode(raw);
    if (decoded is! Map<String, dynamic>) return false;
    final cfg = decoded['appvue'];
    if (cfg is! Map) return false;
    final key = cfg['key'];
    return key is String && key.isNotEmpty;
  } catch (_) {
    return false;
  }
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // Install the durable file logger BEFORE proxy boot so every line lands on
  // disk + the in-memory ring the error page renders.
  await ProxyFileLogger.instance.install();
  pLogf('info', '[boot] app start; logFile=%s h5Url=%s',
      [ProxyFileLogger.instance.logFilePath, _h5Url]);
  AppVuePlugin.setup(
    onWakeupData: (data) {
      pLogf('info', '[appvue] wakeup: %s', [data]);
    },
  );

  final proxyCfg = _parseProxyConfig();
  if (proxyCfg != null) {
    try {
      await ProxyRuntime.instance.start(config: proxyCfg, h5Url: _h5Url);
    } catch (e, st) {
      pLogf('error', '[boot] proxy start failed: %s\n%s', [e, st]);
    }
  } else {
    pLog('info', '[boot] no proxy config; running in direct mode');
  }

  final sentryDsn = _parseSentryDsn();
  if (sentryDsn != null) {
    await SentryBridge.init(sentryDsn);
  } else {
    pLog('info', '[boot] no sentry dsn; skipping init');
  }

  final umengCfg = _parseUmengConfig();
  if (umengCfg != null) {
    await UmengBridge.init(appKey: umengCfg.appKey, channel: umengCfg.channel);
  } else {
    pLog('info', '[boot] no umeng appKey for this platform; skipping init');
  }

  if (_hasFirebaseConfig()) {
    await FirebaseBridge.init();
  } else {
    pLog('info', '[boot] no firebase config; skipping init');
  }

  runApp(const H5App());
}

class H5App extends StatelessWidget {
  const H5App({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: WebViewPage(),
    );
  }
}

class WebViewPage extends StatefulWidget {
  const WebViewPage({super.key});

  @override
  State<WebViewPage> createState() => _WebViewPageState();
}

class _WebViewPageState extends State<WebViewPage> {
  late final WebViewController _controller;

  @override
  void initState() {
    super.initState();
    pLogf('info', '[webview] init H5_URL=%s', [_h5Url]);
    SdkBridge.onProxyRetryComplete = _onRetryDone;
    _initAppVue();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..addJavaScriptChannel(
        'h5appBridge',
        onMessageReceived: (msg) => SdkBridge.onMessage(msg.message),
      )
      ..setNavigationDelegate(NavigationDelegate(
        onPageStarted: (url) => pLogf('info', '[webview] page started: %s', [url]),
        onPageFinished: (url) async {
          pLogf('info', '[webview] page finished: %s', [url]);
          await _controller.runJavaScript(kSdkBridgeBootstrapJs);
          if (sdk_config.customJs.isNotEmpty) {
            try {
              await _controller.runJavaScript(sdk_config.customJs);
            } catch (e) {
              pLogf('error', '[webview] customJs error: %s', [e]);
            }
          }
        },
        onWebResourceError: (error) => pLogf('error',
            '[webview] resource error code=%s desc=%s url=%s',
            [error.errorCode, error.description, error.url]),
        onHttpError: (error) => pLogf('warn', '[webview] http error status=%s',
            [error.response?.statusCode]),
      ));

    final proxyEnabled = sdk_config.proxyConfigJson.isNotEmpty;
    final proxyHealthy = ProxyRuntime.instance.isHealthy;
    final disableDirect = ProxyRuntime.instance.disableDirect;
    pLogf('info', '[webview] proxyEnabled=%s healthy=%s disableDirect=%s',
        [proxyEnabled, proxyHealthy, disableDirect]);
    if (proxyEnabled && !proxyHealthy && disableDirect) {
      pLog('warn', '[webview] proxy unhealthy AND disableDirect=true → showing error page');
      _showErrorPage();
    } else {
      _loadResolvedUrl();
    }
  }

  void _onRetryDone() {
    if (!mounted) return;
    final healthy = ProxyRuntime.instance.isHealthy;
    pLogf('info', '[webview] retry done; healthy=%s', [healthy]);
    if (healthy) {
      _loadResolvedUrl();
    } else {
      _showErrorPage();
    }
  }

  void _showErrorPage() {
    final tail = ProxyFileLogger.instance.tail();
    final logFile = ProxyFileLogger.instance.logFilePath ?? '(unavailable)';
    _controller.loadHtmlString(
      renderProxyErrorHtml(logTail: tail, logFile: logFile),
    );
  }

  Future<void> _loadResolvedUrl() async {
    final originalUri = Uri.parse(_h5Url);
    final domainConfigUrls = _domainConfigUrlsFromConfig();
    final target = domainConfigUrls.isEmpty
        ? originalUri
        : await DomainResolver.resolve(
            originalUrl: originalUri,
            domainConfigUrls: domainConfigUrls,
          );
    if (!mounted) return;
    _controller.loadRequest(target);
  }

  List<String> _domainConfigUrlsFromConfig() {
    final raw = sdk_config.proxyConfigJson;
    if (raw.isEmpty) return const [];
    try {
      final decoded = jsonDecode(raw);
      if (decoded is! Map<String, dynamic>) return const [];
      final urls = decoded['domainConfigUrls'];
      if (urls is! List) return const [];
      return urls.whereType<String>().where((s) => s.isNotEmpty).toList();
    } catch (_) {
      return const [];
    }
  }

  Future<void> _initAppVue() async {
    if (!_hasAppVueConfig()) {
      pLog('info', '[appvue] no key configured; skipping init');
      return;
    }
    try {
      await AppVuePlugin.init();
      pLog('info', '[appvue] sdk initialized');

      final installData = await AppVuePlugin.getInstallData();
      if (installData != null && !installData.isEmpty) {
        pLogf('info', '[appvue] install data: %s', [installData]);
      }

      await AppVuePlugin.reportEvent('app_launch', value: 1, props: {
        'h5_url': _h5Url,
      });
      pLog('info', '[appvue] app_launch event reported');
    } catch (e) {
      pLogf('warn', '[appvue] init error: %s', [e]);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        top: true,
        bottom: true,
        left: true,
        right: true,
        child: WebViewWidget(controller: _controller),
      ),
    );
  }
}
