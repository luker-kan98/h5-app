import 'package:flutter/services.dart';

import 'proxy/file_logger.dart';

/// Thin MethodChannel wrapper around native Firebase Analytics + Crashlytics
/// on Android / iOS. The native helper detects Firebase via reflection, so
/// every call is safely a no-op when Firebase pods/deps are absent.
class FirebaseBridge {
  static const _channel = MethodChannel('com.h5packager.h5_app/firebase');
  static bool _initialized = false;

  static bool get isInitialized => _initialized;

  static Future<bool> init() async {
    try {
      final ok = await _channel.invokeMethod<bool>('init');
      _initialized = ok ?? false;
      pLogf('info', '[firebase] init initialized=%s', [_initialized]);
      return _initialized;
    } catch (e) {
      pLogf('error', '[firebase] init failed: %s', [e]);
      _initialized = false;
      return false;
    }
  }

  static Future<void> logEvent(String name, Map<String, dynamic>? props) async {
    if (!_initialized) return;
    try {
      await _channel.invokeMethod('logEvent', {
        'name': name,
        if (props != null && props.isNotEmpty) 'props': props,
      });
    } catch (e) {
      pLogf('warn', '[firebase] logEvent failed: %s', [e]);
    }
  }

  static Future<void> setUserId(String? id) async {
    if (!_initialized) return;
    try {
      await _channel.invokeMethod('setUserId', {'id': id});
    } catch (e) {
      pLogf('warn', '[firebase] setUserId failed: %s', [e]);
    }
  }

  static Future<void> setUserProperty(String key, String? value) async {
    if (!_initialized) return;
    try {
      await _channel.invokeMethod('setUserProperty', {
        'key': key,
        'value': value,
      });
    } catch (e) {
      pLogf('warn', '[firebase] setUserProperty failed: %s', [e]);
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
      pLogf('warn', '[firebase] captureException failed: %s', [e]);
    }
  }

  static Future<void> captureMessage(String message) async {
    if (!_initialized) return;
    try {
      await _channel.invokeMethod('captureMessage', {'message': message});
    } catch (e) {
      pLogf('warn', '[firebase] captureMessage failed: %s', [e]);
    }
  }
}
