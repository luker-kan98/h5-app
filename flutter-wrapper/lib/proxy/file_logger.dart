import 'dart:async';
import 'dart:collection';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:path_provider/path_provider.dart' as path_provider;

/// Durable proxy logger. Mirrors the electron-wrapper file-logger.
///
/// Why: on a release Android build, `debugPrint` goes nowhere the user can
/// retrieve (no devtools, no terminal stdout). We need a file the user (or we)
/// can pull off the device — and an in-memory ring the error page can render.
///
/// Levels are strings ('log' | 'info' | 'warn' | 'error') to match the
/// electron logger's wire format so support snippets are interchangeable.
class ProxyFileLogger {
  static final ProxyFileLogger instance = ProxyFileLogger._();
  ProxyFileLogger._();

  static const int _ringLines = 500;
  static const int _maxBytes = 1 * 1024 * 1024;
  static const String _fileName = 'h5-proxy.log';

  IOSink? _sink;
  File? _file;
  final Queue<String> _ring = Queue<String>();
  bool _installed = false;

  String? get logFilePath => _file?.path;

  /// Installs the logger. Idempotent; safe to call multiple times.
  /// Returns once the file has been opened (or we've decided we can't open one,
  /// in which case the ring buffer still works).
  Future<void> install() async {
    if (_installed) return;
    _installed = true;
    try {
      final dir = await path_provider.getApplicationCacheDirectory();
      final f = File('${dir.path}/$_fileName');
      await _rotateIfTooBig(f);
      _file = f;
      _sink = f.openWrite(mode: FileMode.append);
      _writeLine('---- session start ${DateTime.now().toIso8601String()} ----');
    } catch (e) {
      // File ops fail (read-only fs, permission, etc). Stay in ring-only mode.
      debugPrint('[file-logger] install failed: $e');
    }
  }

  /// Returns the current ring buffer joined as multi-line text.
  String tail() => _ring.join('\n');

  void log(String level, String message) {
    final line =
        '[${DateTime.now().toIso8601String()}] [$level] $message';
    // Always echo via debugPrint so `flutter run` / logcat picks it up.
    debugPrint(line);
    _pushRing(line);
    _writeLine(line);
  }

  void _pushRing(String line) {
    _ring.addLast(line);
    while (_ring.length > _ringLines) {
      _ring.removeFirst();
    }
  }

  void _writeLine(String line) {
    final s = _sink;
    if (s == null) return;
    try {
      s.writeln(line);
    } catch (_) {
      // Sink closed mid-write — drop silently; ring still has it.
    }
  }

  Future<void> _rotateIfTooBig(File f) async {
    try {
      if (!await f.exists()) return;
      final stat = await f.stat();
      if (stat.size <= _maxBytes) return;
      final rotated = File('${f.path}.1');
      if (await rotated.exists()) await rotated.delete();
      await f.rename(rotated.path);
    } catch (_) {
      // Best-effort rotation.
    }
  }
}

/// Convenience top-level helper so callsites read like `pLog('info', '...')`.
void pLog(String level, String message) =>
    ProxyFileLogger.instance.log(level, message);

/// Convenience for formatted multi-arg logging — keeps callsites pithy.
void pLogf(String level, String fmt, [List<Object?> args = const []]) {
  if (args.isEmpty) {
    pLog(level, fmt);
    return;
  }
  var i = 0;
  final out = fmt.replaceAllMapped(RegExp(r'%[sd]'), (m) {
    if (i >= args.length) return m.group(0)!;
    return '${args[i++]}';
  });
  pLog(level, out);
}
