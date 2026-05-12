import 'dart:async';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:path_provider/path_provider.dart' as path_provider;

import 'file_logger.dart';
import 'node_pool.dart';
import 'probe_selector.dart';
import 'proxy_controller.dart';
import 'proxy_node.dart';
import 'singbox_supervisor.dart';

/// Singleton orchestrating: node pool bootstrap → probe → start sing-box →
/// route WebView traffic through the local HTTP inbound. Only runs on
/// Android in this iteration.
class ProxyRuntime {
  static final ProxyRuntime instance = ProxyRuntime._();
  ProxyRuntime._();

  bool _started = false;
  bool _isHealthy = false;
  Map<String, dynamic>? _savedConfig;
  String? _savedH5Url;
  late SingboxSupervisor _supervisor;
  late NodePool _pool;
  late ProbeSelector _selector;
  Timer? _refreshTimer;

  bool get isHealthy => _isHealthy;
  bool get disableDirect => _savedConfig?['disableDirect'] == true;

  /// Boots the runtime. Caller must invoke before creating any
  /// WebViewController so that setProxyOverride takes effect.
  Future<void> start({
    required Map<String, dynamic> config,
    required String h5Url,
  }) async {
    if (_started) return;
    _started = true;
    _savedConfig = config;
    _savedH5Url = h5Url;

    final cacheDir = await path_provider.getApplicationCacheDirectory();
    final binaryPath = await _resolveBinaryPath();
    pLogf(
      'info',
      '[runtime] start platform=%s cacheDir=%s binary=%s disableDirect=%s',
      [Platform.operatingSystem, cacheDir.path, binaryPath, disableDirect],
    );

    _supervisor = SingboxSupervisor(
      binaryPath: binaryPath,
      configDir: cacheDir.path,
    );

    // builtinProxies are pre-validated server-side, but defend against runtime
    // schema drift by filtering — same pattern as NodePool's OSS feed path.
    final builtin = ((config['builtinProxies'] as List?) ?? const [])
        .whereType<Map<String, dynamic>>()
        .map<ProxyNode?>((m) {
          try {
            return ProxyNode.fromJson(m);
          } catch (_) {
            return null;
          }
        })
        .whereType<ProxyNode>()
        .toList();
    final ossUrls = ((config['ossUrls'] as List?) ?? const [])
        .map((e) => e as String)
        .toList();
    final dnsTxtDomains = ((config['dnsTxtDomains'] as List?) ?? const [])
        .map((e) => e as String)
        .toList();
    final intervalH = (config['updateIntervalHours'] as num? ?? 1).toDouble();

    pLogf('info', '[runtime] config: builtin=%s ossUrls=%s dnsTxt=%s intervalH=%s',
        [builtin.length, ossUrls.length, dnsTxtDomains.length, intervalH]);
    _pool = NodePool(
      builtin: builtin,
      ossUrls: ossUrls,
      dnsTxtDomains: dnsTxtDomains,
    );
    await _pool.bootstrap();
    pLogf('info', '[runtime] pool bootstrap done; nodes=%s', [_pool.nodes.length]);

    _selector = ProbeSelector(
      h5Url: h5Url,
      supervisor: _supervisor,
    );

    final winner = await _selector.pick(_pool.nodes);
    if (winner == null) {
      pLog('error', '[runtime] no healthy node — proxy disabled');
      _isHealthy = false;
      await _supervisor.stop();
      return;
    }
    pLogf('info', '[runtime] winner=%s', [winner.name]);

    final supported = await WebViewProxyController.isSupported();
    if (!supported) {
      pLog('error', '[runtime] PROXY_OVERRIDE not supported on this WebView');
      _isHealthy = false;
      return;
    }
    final url = 'http://${_supervisor.httpAddress}';
    try {
      await WebViewProxyController.setHttpProxy(url);
      pLogf('info', '[runtime] WebView proxy override -> %s', [url]);
    } catch (e) {
      pLogf('error', '[runtime] setHttpProxy failed: %s', [e]);
      _isHealthy = false;
      return;
    }
    _isHealthy = true;
    pLog('info', '[runtime] healthy');

    // If sing-box later crashes past its restart budget, stop trusting the
    // proxy. Callers that gate UI on `isHealthy` (notably main.dart's error
    // page) will then re-evaluate on the next frame.
    attachGaveUp(_supervisor.gaveUp, (healthy) => _isHealthy = healthy);

    _refreshTimer = Timer.periodic(
      Duration(milliseconds: (intervalH * 3600 * 1000).round()),
      (_) => _refresh(),
    );
  }

  /// Test seam + production wiring for the supervisor's gaveUp signal.
  /// On gaveUp, marks the runtime unhealthy and tears down the timer so
  /// the next refresh tick won't fire on a dead supervisor.
  void attachGaveUp(Future<void> gaveUp, void Function(bool) onHealthChange) {
    gaveUp.then((_) {
      onHealthChange(false);
      _refreshTimer?.cancel();
      _refreshTimer = null;
    }).catchError((Object _) {
      onHealthChange(false);
      _refreshTimer?.cancel();
      _refreshTimer = null;
    });
  }

  Future<void> _refresh() async {
    try {
      await _pool.refresh();
    } catch (_) {
      // Refresh failures are swallowed; the pool retains its previous state.
    }
  }

  /// Tears down the supervisor and resets so a subsequent retry can boot
  /// from scratch. Used by the error page's "重试" button.
  Future<void> retry() async {
    final cfg = _savedConfig;
    final url = _savedH5Url;
    _refreshTimer?.cancel();
    _refreshTimer = null;
    try {
      await _supervisor.stop();
    } catch (_) {}
    _started = false;
    _isHealthy = false;
    if (cfg != null && url != null) {
      await start(config: cfg, h5Url: url);
    }
  }

  Future<String> _resolveBinaryPath() async {
    if (Platform.isAndroid) {
      const ch = MethodChannel('h5_app/native_lib_dir');
      final dir = await ch.invokeMethod<String>('get');
      if (dir == null) {
        throw StateError('native_lib_dir channel returned null');
      }
      return '$dir/libsingbox.so';
    }
    throw UnsupportedError('proxy runtime currently supports Android only');
  }
}
