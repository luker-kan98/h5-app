import 'package:flutter/services.dart';

class AppVueTrackData {
  final String? channel;
  final String? referrer;

  const AppVueTrackData({this.channel, this.referrer});

  factory AppVueTrackData.fromMap(Map<dynamic, dynamic> map) {
    return AppVueTrackData(
      channel: map['channel'] as String?,
      referrer: map['referrer'] as String?,
    );
  }

  bool get isEmpty => channel == null && referrer == null;

  @override
  String toString() => 'AppVueTrackData(channel: $channel, referrer: $referrer)';
}

typedef WakeupDataCallback = void Function(AppVueTrackData data);

class AppVuePlugin {
  static const _channel = MethodChannel('com.h5packager.h5_app/appvue');
  static WakeupDataCallback? _onWakeupData;

  static void setup({WakeupDataCallback? onWakeupData}) {
    _onWakeupData = onWakeupData;
    _channel.setMethodCallHandler(_handleMethod);
  }

  static Future<void> _handleMethod(MethodCall call) async {
    if (call.method == 'onWakeupData' && _onWakeupData != null) {
      final map = call.arguments as Map<dynamic, dynamic>;
      _onWakeupData!(AppVueTrackData.fromMap(map));
    }
  }

  /// Initialize the AppVue SDK (call after privacy consent is obtained)
  static Future<void> init() async {
    await _channel.invokeMethod('init');
  }

  /// Get install attribution data
  static Future<AppVueTrackData?> getInstallData() async {
    final result = await _channel.invokeMethod('getInstallData');
    if (result == null) return null;
    return AppVueTrackData.fromMap(result as Map<dynamic, dynamic>);
  }

  /// Get wakeup attribution data from a deep link URL
  static Future<AppVueTrackData?> getWakeupData(String url) async {
    final result = await _channel.invokeMethod('getWakeupData', {'url': url});
    if (result == null) return null;
    return AppVueTrackData.fromMap(result as Map<dynamic, dynamic>);
  }

  /// Report a custom event
  static Future<void> reportEvent(
    String code, {
    int value = 0,
    Map<String, String>? props,
  }) async {
    await _channel.invokeMethod('reportEvent', {
      'code': code,
      'value': value,
      if (props != null) 'props': props,
    });
  }

  /// Enable or disable SDK logging (iOS only)
  static Future<void> setLoggingEnabled(bool enabled) async {
    await _channel.invokeMethod('setLoggingEnabled', {'enabled': enabled});
  }
}
