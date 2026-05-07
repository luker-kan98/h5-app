import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'appvue_plugin.dart';
import 'sdk_bridge.dart';
import 'sdk_config.dart' as sdk_config;

const String _h5Url = String.fromEnvironment('H5_URL', defaultValue: 'about:blank');

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  AppVuePlugin.setup(
    onWakeupData: (data) {
      debugPrint('AppVue wakeup: $data');
    },
  );
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
      ))
      ..loadRequest(Uri.parse(_h5Url));
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
