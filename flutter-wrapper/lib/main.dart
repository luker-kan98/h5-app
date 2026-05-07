import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'appvue_plugin.dart';
import 'proxy/error_page.dart';
import 'proxy/proxy_runtime.dart';
import 'sdk_bridge.dart';
import 'sdk_config.dart' as sdk_config;

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

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  AppVuePlugin.setup(
    onWakeupData: (data) {
      debugPrint('AppVue wakeup: $data');
    },
  );

  final proxyCfg = _parseProxyConfig();
  if (proxyCfg != null) {
    try {
      await ProxyRuntime.instance.start(config: proxyCfg, h5Url: _h5Url);
    } catch (e) {
      debugPrint('proxy start failed: $e');
    }
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
    debugPrint('H5_URL: $_h5Url');
    _initAppVue();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..addJavaScriptChannel(
        'h5appBridge',
        onMessageReceived: (msg) => SdkBridge.onMessage(msg.message),
      )
      ..setNavigationDelegate(NavigationDelegate(
        onPageStarted: (url) => debugPrint('Page started: $url'),
        onPageFinished: (url) async {
          debugPrint('Page finished: $url');
          await _controller.runJavaScript(kSdkBridgeBootstrapJs);
          if (sdk_config.customJs.isNotEmpty) {
            try {
              await _controller.runJavaScript(sdk_config.customJs);
            } catch (e) {
              debugPrint('customJs error: $e');
            }
          }
        },
        onWebResourceError: (error) => debugPrint('WebView error: ${error.errorCode} - ${error.description}'),
        onHttpError: (error) => debugPrint('HTTP error: ${error.response?.statusCode}'),
      ));

    final proxyEnabled = sdk_config.proxyConfigJson.isNotEmpty;
    final proxyHealthy = ProxyRuntime.instance.isHealthy;
    final disableDirect = ProxyRuntime.instance.disableDirect;
    if (proxyEnabled && !proxyHealthy && disableDirect) {
      _controller.loadHtmlString(proxyErrorHtml);
    } else {
      _controller.loadRequest(Uri.parse(_h5Url));
    }
  }

  Future<void> _initAppVue() async {
    try {
      await AppVuePlugin.init();
      debugPrint('AppVue SDK initialized');

      final installData = await AppVuePlugin.getInstallData();
      if (installData != null && !installData.isEmpty) {
        debugPrint('AppVue install data: $installData');
      }

      await AppVuePlugin.reportEvent('app_launch', value: 1, props: {
        'h5_url': _h5Url,
      });
      debugPrint('AppVue app_launch event reported');
    } catch (e) {
      debugPrint('AppVue init error: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: WebViewWidget(controller: _controller),
    );
  }
}
