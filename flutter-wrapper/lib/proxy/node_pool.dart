import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;

import 'proxy_node.dart';

class NodePool {
  final List<ProxyNode> builtin;
  final List<String> ossUrls;
  final List<String> dnsTxtDomains;
  final http.Client _http;
  static const _fetchTimeout = Duration(seconds: 5);

  List<ProxyNode> _nodes;

  NodePool({
    required this.builtin,
    required this.ossUrls,
    required this.dnsTxtDomains,
    http.Client? httpClient,
  })  : _http = httpClient ?? http.Client(),
        _nodes = List.of(builtin);

  List<ProxyNode> get nodes => List.unmodifiable(_nodes);

  Future<void> bootstrap() async {
    await refresh();
  }

  Future<void> refresh() async {
    final ossNodes = await _gatherOss();
    final txtNodes = await _gatherDnsTxt();

    final merged = <ProxyNode>[
      ...builtin,
      ...ossNodes,
      ...txtNodes,
    ];

    if (merged.isEmpty && _nodes.isNotEmpty) {
      // Refresh failed entirely; retain previous pool.
      return;
    }
    _nodes = merged;
  }

  Future<List<ProxyNode>> _gatherOss() async {
    final futures = ossUrls.map(_fetchOssOne);
    final results = await Future.wait(futures);
    return results.expand((x) => x).toList();
  }

  Future<List<ProxyNode>> _fetchOssOne(String url) async {
    try {
      final resp = await _http.get(Uri.parse(url)).timeout(_fetchTimeout);
      if (resp.statusCode != 200) return const [];
      final data = jsonDecode(resp.body) as Map<String, dynamic>;
      final list = (data['proxies'] as List? ?? const []);
      return list
          .whereType<Map<String, dynamic>>()
          .map(_safeFromJson)
          .whereType<ProxyNode>()
          .toList();
    } catch (_) {
      return const [];
    }
  }

  ProxyNode? _safeFromJson(Map<String, dynamic> j) {
    try {
      return ProxyNode.fromJson(j);
    } catch (_) {
      return null;
    }
  }

  Future<List<ProxyNode>> _gatherDnsTxt() async {
    if (dnsTxtDomains.isEmpty) return const [];
    final futures = dnsTxtDomains.map(_queryDoh);
    final results = await Future.wait(futures);
    return results.expand((x) => x).toList();
  }

  Future<List<ProxyNode>> _queryDoh(String domain) async {
    try {
      final url = Uri.parse(
        'https://1.1.1.1/dns-query?name=$domain&type=TXT',
      );
      final resp = await _http
          .get(url, headers: const {'Accept': 'application/dns-json'})
          .timeout(_fetchTimeout);
      if (resp.statusCode != 200) return const [];
      final data = jsonDecode(resp.body) as Map<String, dynamic>;
      final answers = (data['Answer'] as List? ?? const []);
      final nodes = <ProxyNode>[];
      for (final a in answers) {
        if (a is! Map<String, dynamic>) continue;
        final raw = (a['data'] as String?)?.replaceAll('"', '').trim();
        if (raw == null || !raw.startsWith('ss://')) continue;
        final node = _parseSsUri(raw);
        if (node != null) nodes.add(node);
      }
      return nodes;
    } catch (_) {
      return const [];
    }
  }

  ProxyNode? _parseSsUri(String uri) {
    // Minimal SS URI parser for DoH-discovered nodes. Mirrors the backend
    // parser shape: ss://BASE64(method:password)@host:port[#name]
    try {
      final body = uri.substring('ss://'.length);
      final hashIdx = body.indexOf('#');
      var name = '';
      var rest = body;
      if (hashIdx >= 0) {
        name = Uri.decodeComponent(body.substring(hashIdx + 1));
        rest = body.substring(0, hashIdx);
      }
      final atIdx = rest.lastIndexOf('@');
      if (atIdx < 0) return null;
      final userinfo = rest.substring(0, atIdx);
      final hostport = rest.substring(atIdx + 1);
      final colonIdx = hostport.lastIndexOf(':');
      if (colonIdx < 0) return null;
      final host = hostport.substring(0, colonIdx);
      final port = int.tryParse(hostport.substring(colonIdx + 1)) ?? 0;
      if (port < 1 || port > 65535) return null;
      final paddedB64 = userinfo + '=' * ((4 - userinfo.length % 4) % 4);
      final decoded = utf8.decode(base64Url.decode(
        paddedB64.replaceAll('+', '-').replaceAll('/', '_'),
      ));
      final partIdx = decoded.indexOf(':');
      if (partIdx < 0) return null;
      return ProxyNode(
        name: name.isEmpty ? '$host:$port' : name,
        type: 'ss',
        server: host,
        port: port,
        cipher: decoded.substring(0, partIdx),
        password: decoded.substring(partIdx + 1),
      );
    } catch (_) {
      return null;
    }
  }

  void dispose() => _http.close();
}
