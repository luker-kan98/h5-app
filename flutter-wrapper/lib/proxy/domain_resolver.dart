import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

class DomainResolver {
  static const Duration _fetchTimeout = Duration(seconds: 5);
  static const Duration _probeTimeout = Duration(seconds: 3);

  /// Try to swap the host of [originalUrl] for the first reachable domain
  /// listed in any of [domainConfigUrls]. Returns [originalUrl] if no override
  /// can be resolved or none of the candidates respond.
  ///
  /// Each entry in [domainConfigUrls] points at a plain-text file that lists
  /// one candidate domain per line. We fetch the first config URL that
  /// succeeds, then probe each domain in order with HEAD (falling back to GET)
  /// and pick the first 2xx/3xx response.
  static Future<Uri> resolve({
    required Uri originalUrl,
    required List<String> domainConfigUrls,
  }) async {
    if (domainConfigUrls.isEmpty) return originalUrl;

    final candidates = await _fetchCandidates(domainConfigUrls);
    if (candidates.isEmpty) return originalUrl;

    for (final domain in candidates) {
      final candidate = originalUrl.replace(host: domain, port: 0);
      if (await _isReachable(candidate)) {
        debugPrint('DomainResolver: selected $candidate');
        return candidate;
      }
    }

    debugPrint('DomainResolver: no candidate reachable, falling back to $originalUrl');
    return originalUrl;
  }

  static Future<List<String>> _fetchCandidates(List<String> configUrls) async {
    for (final raw in configUrls) {
      final uri = Uri.tryParse(raw);
      if (uri == null) continue;
      try {
        final response = await http.get(uri).timeout(_fetchTimeout);
        if (response.statusCode >= 200 && response.statusCode < 300) {
          final lines = response.body
              .split(RegExp(r'\r?\n'))
              .map((l) => l.trim())
              .where((l) => l.isNotEmpty && !l.startsWith('#'))
              .toList();
          if (lines.isNotEmpty) return lines;
        }
      } catch (e) {
        debugPrint('DomainResolver: fetch $uri failed: $e');
      }
    }
    return const [];
  }

  static Future<bool> _isReachable(Uri url) async {
    try {
      final head = await http.head(url).timeout(_probeTimeout);
      if (_isOk(head.statusCode)) return true;
      // Some hosts disallow HEAD; fall back to GET.
      if (head.statusCode == 405 || head.statusCode == 501) {
        final get = await http.get(url).timeout(_probeTimeout);
        return _isOk(get.statusCode);
      }
      return false;
    } catch (e) {
      debugPrint('DomainResolver: probe $url failed: $e');
      return false;
    }
  }

  static bool _isOk(int status) => status >= 200 && status < 400;
}
