import 'package:flutter/services.dart';

import 'proxy/file_logger.dart';

/// Thin MethodChannel wrapper around the native Sentry SDK on Android / iOS.
/// All calls are no-ops if [init] was never called or returned false (no DSN).
class SentryBridge {
  static const _channel = MethodChannel('com.h5packager.h5_app/sentry');
  static bool _initialized = false;

  static bool get isInitialized => _initialized;

  static Future<bool> init(String dsn) async {
    if (dsn.isEmpty) {
      _initialized = false;
      return false;
    }
    try {
      final ok = await _channel.invokeMethod<bool>('init', {'dsn': dsn});
      _initialized = ok ?? false;
      pLogf('info', '[sentry] init dsn=%s initialized=%s',
          [_redact(dsn), _initialized]);
      return _initialized;
    } catch (e) {
      pLogf('error', '[sentry] init failed: %s', [e]);
      _initialized = false;
      return false;
    }
  }

  static Future<void> captureException(String message, String stack) async {
    if (!_initialized) return;
    try {
      await _channel.invokeMethod('captureException', {
        'message': message,
        'stack': stack,
      });
    } catch (e) {
      pLogf('warn', '[sentry] captureException failed: %s', [e]);
    }
  }

  static Future<void> captureMessage(String message) async {
    if (!_initialized) return;
    try {
      await _channel.invokeMethod('captureMessage', {'message': message});
    } catch (e) {
      pLogf('warn', '[sentry] captureMessage failed: %s', [e]);
    }
  }

  static String _redact(String dsn) {
    if (dsn.length <= 12) return '***';
    return '${dsn.substring(0, 8)}…${dsn.substring(dsn.length - 4)}';
  }
}
