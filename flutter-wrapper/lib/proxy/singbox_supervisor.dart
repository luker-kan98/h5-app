import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'file_logger.dart';
import 'proxy_node.dart';

/// Factory for creating a process. Returns a handle that exposes
/// `int get pid`, `Future<int> get exitCode`, and `void kill()`.
///
/// In production this is backed by `Process.start` (see [_RealProcessAdapter]).
/// Tests inject a fake process whose interface is structurally compatible —
/// hence `dynamic` here, so the fake doesn't need to extend a Dart class.
typedef ProcessFactory = Future<dynamic> Function(
  String binary,
  List<String> args,
);

class _RealProcessAdapter {
  final Process _proc;
  _RealProcessAdapter(this._proc) {
    // Tee sing-box's own stdout/stderr (it logs DNS lookups, dial errors,
    // outbound failures, etc.) into our durable file logger so the user can
    // diagnose without an attached debugger. sing-box already prints with its
    // own timestamps; we add level=info/error and a tag so the merged log is
    // greppable.
    _proc.stdout.transform(utf8.decoder).transform(const LineSplitter()).listen(
      (line) => pLog('info', '[sing-box] $line'),
      onError: (Object e) => pLog('error', '[sing-box] stdout error: $e'),
    );
    _proc.stderr.transform(utf8.decoder).transform(const LineSplitter()).listen(
      (line) => pLog('warn', '[sing-box] $line'),
      onError: (Object e) => pLog('error', '[sing-box] stderr error: $e'),
    );
  }
  int get pid => _proc.pid;
  Future<int> get exitCode => _proc.exitCode;
  void kill() => _proc.kill();
}

/// Supervises a sing-box process: writes its config, spawns it, and
/// restarts on crash up to [_maxRestartsPerMinute] times within a 60s
/// rolling window. Once that limit is exceeded, [gaveUp] resolves and
/// no further restarts happen.
class SingboxSupervisor {
  static const _socksPort = 1080;
  static const _httpPort = 1081;
  static const _maxRestartsPerMinute = 3;

  final String binaryPath;
  final String configDir;
  final ProcessFactory _factory;

  ProxyNode? _currentNode;
  dynamic _process;
  StreamSubscription<int>? _exitSub;
  final List<DateTime> _recentStarts = [];
  final Completer<void> _gaveUp = Completer<void>();
  bool _stopped = false;

  SingboxSupervisor({
    required this.binaryPath,
    required this.configDir,
    ProcessFactory? processFactory,
  }) : _factory = processFactory ?? _spawnReal;

  static Future<dynamic> _spawnReal(String binary, List<String> args) async {
    final p = await Process.start(binary, args);
    return _RealProcessAdapter(p);
  }

  Future<void> get gaveUp => _gaveUp.future;
  String get socksAddress => '127.0.0.1:$_socksPort';
  String get httpAddress => '127.0.0.1:$_httpPort';

  Future<void> startWith(ProxyNode node) async {
    _currentNode = node;
    await _spawn();
  }

  Future<void> _spawn() async {
    if (_stopped) return;
    final node = _currentNode;
    if (node != null) {
      pLogf(
        'info',
        '[supervisor] spawn binary=%s socks=%s http=%s node=%s server=%s:%s cipher=%s',
        [binaryPath, socksAddress, httpAddress, node.name, node.server, node.port, node.cipher],
      );
    }
    // If a previous process is still running (e.g. from probe-selector
    // walking through candidate nodes), terminate it before spawning the
    // next one. Otherwise we accumulate orphan sing-box processes.
    // Cancellation is fire-and-forget: under the test fakes the source
    // Future never completes, so awaiting cancel() can hang. The _stopped
    // flag plus nulling the ref are what actually prevent stale callbacks.
    _exitSub?.cancel();
    _exitSub = null;
    try {
      (_process as dynamic)?.kill();
    } catch (_) {}

    final cfgPath = '$configDir/singbox-config.json';
    await File(cfgPath).writeAsString(_renderConfig(_currentNode!));
    // Restrict permissions: the config contains the proxy password.
    // chmod is a no-op on Windows; the runProcess returns silently if it fails,
    // which is acceptable since the leaked-permission consequence is the same.
    if (!Platform.isWindows) {
      try {
        final result = await Process.run('chmod', ['600', cfgPath]);
        // Surface non-zero exit in debug/test builds so a silent chmod
        // failure (e.g. chmod absent from PATH on some Android variants)
        // doesn't leave the password-bearing config world-readable
        // without any signal.
        assert(
          result.exitCode == 0,
          'chmod 600 failed (exit ${result.exitCode}): ${result.stderr}',
        );
      } catch (_) { /* best-effort */ }
    }
    _recentStarts.add(DateTime.now());

    final handle = await _factory(binaryPath, ['run', '-c', cfgPath]);
    _process = handle;

    final exitFuture = handle.exitCode as Future<int>;
    _exitSub = exitFuture.asStream().listen((_) {
      if (_stopped) return;
      _onExit();
    });
  }

  void _onExit() {
    final now = DateTime.now();
    _recentStarts.removeWhere(
      (t) => now.difference(t) > const Duration(minutes: 1),
    );
    // 1 initial start + _maxRestartsPerMinute restarts = threshold.
    // If we've started more than that in the last minute, give up.
    if (_recentStarts.length >= _maxRestartsPerMinute + 1) {
      if (!_gaveUp.isCompleted) _gaveUp.complete();
      return;
    }
    // Fire-and-forget restart, but route any exception (file write failure,
    // factory throw) into gaveUp so callers waiting on it don't hang.
    _spawn().catchError((Object e, StackTrace st) {
      if (!_gaveUp.isCompleted) _gaveUp.completeError(e, st);
    });
  }

  String _renderConfig(ProxyNode node) {
    return const JsonEncoder.withIndent('  ').convert({
      // 'info' so dial errors / dns lookups for the SS server show up in our
      // tee'd log; the file rotates at 1MB so noise is bounded.
      'log': {'level': 'info', 'disabled': false, 'timestamp': true},
      'inbounds': [
        {
          'type': 'socks',
          'tag': 'socks-in',
          'listen': '127.0.0.1',
          'listen_port': _socksPort,
        },
        {
          'type': 'http',
          'tag': 'http-in',
          'listen': '127.0.0.1',
          'listen_port': _httpPort,
        },
      ],
      'outbounds': [
        {
          'type': 'shadowsocks',
          'tag': 'proxy-out',
          'server': node.server,
          'server_port': node.port,
          'method': node.cipher,
          'password': node.password,
        }
      ],
    });
  }

  Future<void> stop() async {
    _stopped = true;
    _exitSub?.cancel();
    _exitSub = null;
    try {
      (_process as dynamic)?.kill();
    } catch (_) {}
  }
}
