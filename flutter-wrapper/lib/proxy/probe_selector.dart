import 'dart:async';
import 'dart:io';

import 'proxy_node.dart';

typedef ProbeFn = Future<bool> Function(ProxyNode node, String h5Url);

/// Walks an ordered list of proxy nodes, asking the supervisor to start each
/// in turn, then probing the H5 URL through the local HTTP proxy. Returns
/// the first node whose probe succeeds, or null if all fail.
class ProbeSelector {
  final String h5Url;
  // Duck-typed: must expose `startWith(ProxyNode)`. Using `dynamic` here
  // matches the supervisor's own dynamic process handle convention and lets
  // tests pass a fake without inheriting from a base class.
  final dynamic supervisor;
  final ProbeFn _probe;

  ProbeSelector({
    required this.h5Url,
    required this.supervisor,
    ProbeFn? probe,
  }) : _probe = probe ?? _httpHeadProbe;

  Future<ProxyNode?> pick(List<ProxyNode> nodes) async {
    for (final node in nodes) {
      await supervisor.startWith(node);
      // Brief delay so sing-box has time to bind sockets. Tests inject a
      // synthetic probe so the delay is paid only in production paths.
      await Future<void>.delayed(const Duration(milliseconds: 200));
      try {
        if (await _probe(node, h5Url)) return node;
      } catch (_) {
        // probe failure is non-fatal; try the next node
      }
    }
    return null;
  }

  static Future<bool> _httpHeadProbe(ProxyNode node, String h5Url) async {
    final client = HttpClient();
    client.findProxy = (uri) => 'PROXY 127.0.0.1:1081';
    try {
      final req = await client
          .headUrl(Uri.parse(h5Url))
          .timeout(const Duration(seconds: 5));
      final resp = await req.close().timeout(const Duration(seconds: 5));
      await resp.drain<void>();
      return resp.statusCode >= 200 && resp.statusCode < 400;
    } catch (_) {
      return false;
    } finally {
      client.close(force: true);
    }
  }
}
