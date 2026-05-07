import 'package:flutter/services.dart';

/// Dart-side wrapper for the Kotlin `ProxyControllerPlugin` that bridges
/// `androidx.webkit.ProxyController.setProxyOverride()`. Call
/// `setHttpProxy(...)` BEFORE creating any WebViewController — the override
/// only affects WebViews created afterwards.
class WebViewProxyController {
  static const _channel = MethodChannel('h5_app/proxy_controller');

  /// Returns true on devices/WebView versions that support PROXY_OVERRIDE.
  /// Some OEM-customized WebViews lack this feature.
  static Future<bool> isSupported() async {
    final result = await _channel.invokeMethod<bool>('isSupported');
    return result ?? false;
  }

  /// Routes WebView traffic through the given HTTP proxy URL
  /// (e.g. `http://127.0.0.1:1081`).
  static Future<void> setHttpProxy(String url) async {
    await _channel.invokeMethod('setProxy', {'httpProxyUrl': url});
  }

  /// Clears any active proxy override. Safe to call when none is set.
  static Future<void> clear() async {
    await _channel.invokeMethod('clearProxy');
  }
}
