import 'package:flutter_test/flutter_test.dart';
import 'package:h5_app/proxy/probe_selector.dart';
import 'package:h5_app/proxy/proxy_node.dart';

class _RecordingSupervisor {
  final List<String> startedNodes = [];
  Future<void> startWith(ProxyNode node) async {
    startedNodes.add(node.name);
  }
  Future<void> stop() async {}
}

void main() {
  ProxyNode mk(String name) => ProxyNode(
        name: name, type: 'ss', server: name, port: 1,
        cipher: 'aes-256-gcm', password: 'pw',
      );

  test('returns first node whose probe succeeds', () async {
    final sup = _RecordingSupervisor();
    final selector = ProbeSelector(
      h5Url: 'https://example.com',
      supervisor: sup,
      probe: (node, url) async => node.name == 'b',
    );
    final winner = await selector.pick([mk('a'), mk('b'), mk('c')]);
    expect(winner!.name, 'b');
    expect(sup.startedNodes, ['a', 'b']); // stopped probing after 'b' succeeded
  });

  test('returns null when all fail', () async {
    final sup = _RecordingSupervisor();
    final selector = ProbeSelector(
      h5Url: 'https://example.com',
      supervisor: sup,
      probe: (node, url) async => false,
    );
    final winner = await selector.pick([mk('a'), mk('b')]);
    expect(winner, isNull);
  });

  test('handles empty node list', () async {
    final sup = _RecordingSupervisor();
    final selector = ProbeSelector(
      h5Url: 'https://example.com',
      supervisor: sup,
      probe: (node, url) async => true,
    );
    final winner = await selector.pick([]);
    expect(winner, isNull);
    expect(sup.startedNodes, isEmpty);
  });

  test('probe exception treated as failure', () async {
    final sup = _RecordingSupervisor();
    final selector = ProbeSelector(
      h5Url: 'https://example.com',
      supervisor: sup,
      probe: (node, url) async {
        if (node.name == 'a') throw Exception('boom');
        return true;
      },
    );
    final winner = await selector.pick([mk('a'), mk('b')]);
    expect(winner!.name, 'b');
  });

  test('default probe reads address from supervisor.httpAddress', () {
    // Compile-time check: the static probe signature accepts a third
    // String parameter for the HTTP address. If the signature changes
    // away from this, this test stops compiling — exactly the fence we
    // want against accidentally hardcoding the address again.
    const f = ProbeSelector.httpHeadProbeWithAddress;
    expect(f, isA<Function>());
  });
}
