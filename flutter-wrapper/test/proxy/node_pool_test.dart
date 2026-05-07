import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

import 'package:h5_app/proxy/proxy_node.dart';
import 'package:h5_app/proxy/node_pool.dart';

void main() {
  test('built-in nodes available immediately', () async {
    const builtin = [
      ProxyNode(
        name: 'b', type: 'ss', server: 'h', port: 1,
        cipher: 'aes-256-gcm', password: 'pw',
      ),
    ];
    final pool = NodePool(
      builtin: builtin,
      ossUrls: const [],
      dnsTxtDomains: const [],
      httpClient: MockClient((req) async => http.Response('', 404)),
    );
    await pool.bootstrap();
    expect(pool.nodes.length, 1);
    expect(pool.nodes.first.name, 'b');
  });

  test('OSS fetch parses proxies array and merges in priority order', () async {
    const builtin = [
      ProxyNode(
        name: 'builtin', type: 'ss', server: 'b', port: 1,
        cipher: 'aes-256-gcm', password: 'pw',
      ),
    ];
    final mockClient = MockClient((req) async {
      expect(req.url.toString(), 'https://oss.example.com/c.json');
      return http.Response(
        '{"version":1,"updated_at":"2026-05-07T00:00:00Z","proxies":'
        '[{"name":"oss1","type":"ss","server":"o","port":2,'
        '"cipher":"aes-256-gcm","password":"pw"}]}',
        200,
      );
    });
    final pool = NodePool(
      builtin: builtin,
      ossUrls: const ['https://oss.example.com/c.json'],
      dnsTxtDomains: const [],
      httpClient: mockClient,
    );
    await pool.bootstrap();
    expect(pool.nodes.map((n) => n.name).toList(), ['builtin', 'oss1']);
  });

  test('OSS failure does not block; previous pool retained on subsequent refresh', () async {
    int hits = 0;
    final mockClient = MockClient((req) async {
      hits++;
      if (hits == 1) {
        return http.Response(
          '{"proxies":[{"name":"oss1","type":"ss","server":"o","port":2,'
          '"cipher":"aes-256-gcm","password":"pw"}]}',
          200,
        );
      }
      return http.Response('boom', 500);
    });
    final pool = NodePool(
      builtin: const [],
      ossUrls: const ['https://oss.example.com/c.json'],
      dnsTxtDomains: const [],
      httpClient: mockClient,
    );
    await pool.bootstrap();
    expect(pool.nodes.map((n) => n.name), ['oss1']);
    await pool.refresh();
    expect(pool.nodes.map((n) => n.name), ['oss1']); // retained
  });

  test('DoH TXT lookup decodes ss:// URI into a node', () async {
    final mockClient = MockClient((req) async {
      expect(req.url.host, '1.1.1.1');
      // base64("aes-256-gcm:doh-pw") = YWVzLTI1Ni1nY206ZG9oLXB3
      return http.Response(
        '{"Status":0,"Answer":[{"name":"fallback.example.com","type":16,"TTL":300,'
        '"data":"\\"ss://YWVzLTI1Ni1nY206ZG9oLXB3@1.2.3.4:8388#fallback\\""}]}',
        200,
      );
    });
    final pool = NodePool(
      builtin: const [],
      ossUrls: const [],
      dnsTxtDomains: const ['fallback.example.com'],
      httpClient: mockClient,
    );
    await pool.bootstrap();
    expect(pool.nodes.length, 1);
    expect(pool.nodes.first.name, 'fallback');
    expect(pool.nodes.first.server, '1.2.3.4');
    expect(pool.nodes.first.port, 8388);
  });
}
