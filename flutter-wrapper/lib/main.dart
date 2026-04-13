import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

const String _h5Url = String.fromEnvironment('H5_URL', defaultValue: 'about:blank');

void main() {
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
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(NavigationDelegate(
        onPageStarted: (url) => debugPrint('Page started: $url'),
        onPageFinished: (url) => debugPrint('Page finished: $url'),
        onWebResourceError: (error) => debugPrint('WebView error: ${error.errorCode} - ${error.description}'),
        onHttpError: (error) => debugPrint('HTTP error: ${error.response?.statusCode}'),
      ))
      ..loadRequest(Uri.parse(_h5Url));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: WebViewWidget(controller: _controller),
    );
  }
}
