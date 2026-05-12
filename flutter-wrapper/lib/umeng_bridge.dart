import 'package:flutter/services.dart';

import 'proxy/file_logger.dart';

/// Thin MethodChannel wrapper around the native Umeng analytics SDK on
/// Android / iOS. All calls are no-ops if [init] was never called or returned
/// false (no app key for the running platform).
class UmengBridge {
  static const _channel = MethodChannel('com.h5packager.h5_app/umeng');
  static bool _initialized = false;

  static bool get isInitialized => _initialized;

  static Future<bool> init({required String appKey, String? channel}) async {
    if (appKey.isEmpty) {
      _initialized = false;
      return false;
    }
    try {
      final ok = await _channel.invokeMethod<bool>('init', {
        'appKey': appKey,
        if (channel != null && channel.isNotEmpty) 'channel': channel,
      });
      _initialized = ok ?? false;
      pLogf('info', '[umeng] init appKey=%s channel=%s initialized=%s',
          [_redact(appKey), channel ?? '(default)', _initialized]);
      return _initialized;
    } catch (e) {
      pLogf('error', '[umeng] init failed: %s', [e]);
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
      pLogf('warn', '[umeng] logEvent failed: %s', [e]);
    }
  }

  static Future<void> setUserId(String? id) async {
    if (!_initialized) return;
    try {
      await _channel.invokeMethod('setUserId', {'id': id ?? ''});
    } catch (e) {
      pLogf('warn', '[umeng] setUserId failed: %s', [e]);
    }
  }

  static Future<void> setUserProperty(String key, String? value) async {
    if (!_initialized) return;
    try {
      await _channel.invokeMethod('setUserProperty', {
        'key': key,
        'value': value ?? '',
      });
    } catch (e) {
      pLogf('warn', '[umeng] setUserProperty failed: %s', [e]);
    }
  }

  static String _redact(String key) {
    if (key.length <= 8) return '***';
    return '${key.substring(0, 4)}…${key.substring(key.length - 2)}';
  }
}
