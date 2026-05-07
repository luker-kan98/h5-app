import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';

import 'proxy/proxy_runtime.dart';

/// Dispatches messages from the H5 page's `window.h5app.*` JS bridge to the
/// active native SDK handlers. For v1 plumbing this is a logging no-op; per-SDK
/// handlers are wired in later increments.
class SdkBridge {
  static void onMessage(String raw) {
    Map<String, dynamic> payload;
    try {
      payload = jsonDecode(raw) as Map<String, dynamic>;
    } catch (e) {
      debugPrint('SdkBridge: bad payload ($e): $raw');
      return;
    }
    final namespace = payload['namespace'] as String?;
    final method = payload['method'] as String?;
    final args = payload['args'];
    debugPrint('SdkBridge call: $namespace.$method($args)');
    if (namespace == 'proxy' && method == 'retry') {
      unawaited(ProxyRuntime.instance.retry());
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
