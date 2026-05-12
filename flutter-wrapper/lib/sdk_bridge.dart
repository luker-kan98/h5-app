import 'dart:async';
import 'dart:convert';

import 'firebase_bridge.dart';
import 'proxy/file_logger.dart';
import 'proxy/proxy_runtime.dart';
import 'sentry_bridge.dart';
import 'umeng_bridge.dart';

/// Dispatches messages from the H5 page's `window.h5app.*` JS bridge to the
/// active native SDK handlers. For v1 plumbing this is a logging no-op; per-SDK
/// handlers are wired in later increments.
class SdkBridge {
  /// Set by the WebView page so we can ask it to reload (or re-show the error
  /// page) once a proxy retry finishes.
  static void Function()? onProxyRetryComplete;

  static void onMessage(String raw) {
    Map<String, dynamic> payload;
    try {
      payload = jsonDecode(raw) as Map<String, dynamic>;
    } catch (e) {
      pLogf('warn', '[sdk-bridge] bad payload (%s): %s', [e, raw]);
      return;
    }
    final namespace = payload['namespace'] as String?;
    final method = payload['method'] as String?;
    final args = payload['args'];
    pLogf('info', '[sdk-bridge] call %s.%s(%s)', [namespace, method, args]);
    if (namespace == 'proxy' && method == 'retry') {
      unawaited(ProxyRuntime.instance.retry().then((_) {
        onProxyRetryComplete?.call();
      }));
      return;
    }
    if (namespace == 'crash') {
      final list = args is List ? args : const [];
      switch (method) {
        case 'captureException':
          final msg = list.isNotEmpty ? '${list[0]}' : '(no message)';
          final stack = list.length > 1 ? '${list[1]}' : '';
          // Fan out to every crash reporter; each is a no-op if not initialized.
          unawaited(SentryBridge.captureException(msg, stack));
          unawaited(FirebaseBridge.captureException(msg, stack));
          break;
        case 'captureMessage':
          final msg = list.isNotEmpty ? '${list[0]}' : '';
          unawaited(SentryBridge.captureMessage(msg));
          unawaited(FirebaseBridge.captureMessage(msg));
          break;
      }
      return;
    }
    if (namespace == 'analytics') {
      final list = args is List ? args : const [];
      switch (method) {
        case 'logEvent':
          if (list.isEmpty) return;
          final name = '${list[0]}';
          final rawProps = list.length > 1 ? list[1] : null;
          final props =
              rawProps is Map ? rawProps.cast<String, dynamic>() : null;
          unawaited(UmengBridge.logEvent(name, props));
          unawaited(FirebaseBridge.logEvent(name, props));
          break;
        case 'setUserId':
          final id = list.isNotEmpty ? '${list[0]}' : '';
          unawaited(UmengBridge.setUserId(id));
          unawaited(FirebaseBridge.setUserId(id));
          break;
        case 'setUserProperty':
          if (list.isEmpty) return;
          final key = '${list[0]}';
          final value = list.length > 1 ? '${list[1]}' : '';
          unawaited(UmengBridge.setUserProperty(key, value));
          unawaited(FirebaseBridge.setUserProperty(key, value));
          break;
      }
    }
  }
}

/// JS injected on every page load to expose `window.h5app` calling the
/// JavaScriptChannel named `h5appBridge`.
const String kSdkBridgeBootstrapJs = r'''
(function() {
  if (window.h5app) return;
  function send(namespace, method, args) {
    try {
      window.h5appBridge.postMessage(JSON.stringify({
        namespace: namespace, method: method, args: args || []
      }));
    } catch (e) { /* bridge not available — silently no-op */ }
  }
  window.h5app = {
    analytics: {
      logEvent: function(name, props) { send('analytics', 'logEvent', [name, props || {}]); },
      setUserId: function(id) { send('analytics', 'setUserId', [id]); },
      setUserProperty: function(k, v) { send('analytics', 'setUserProperty', [k, v]); }
    },
    crash: {
      captureException: function(err) {
        var msg = (err && err.message) ? err.message : String(err);
        var stack = (err && err.stack) ? err.stack : '';
        send('crash', 'captureException', [msg, stack]);
      },
      captureMessage: function(msg) { send('crash', 'captureMessage', [String(msg)]); }
    }
  };
})();
''';
