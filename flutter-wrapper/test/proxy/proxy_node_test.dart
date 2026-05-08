import 'package:flutter_test/flutter_test.dart';
import 'package:h5_app/proxy/proxy_node.dart';

void main() {
  test('fromJson accepts a valid ss node', () {
    final n = ProxyNode.fromJson({
      'name': 'n', 'type': 'ss', 'server': 'h', 'port': 8388,
      'cipher': 'aes-256-gcm', 'password': 'pw',
    });
    expect(n.type, 'ss');
    expect(n.port, 8388);
  });

  test('fromJson rejects unsupported type', () {
    expect(
      () => ProxyNode.fromJson({
        'name': 'n', 'type': 'vmess', 'server': 'h', 'port': 8388,
        'cipher': 'aes-256-gcm', 'password': 'pw',
      }),
      throwsA(isA<FormatException>()),
    );
  });

  test('fromJson rejects port < 1', () {
    expect(
      () => ProxyNode.fromJson({
        'name': 'n', 'type': 'ss', 'server': 'h', 'port': 0,
        'cipher': 'aes-256-gcm', 'password': 'pw',
      }),
      throwsA(isA<FormatException>()),
    );
  });

  test('fromJson rejects port > 65535', () {
    expect(
      () => ProxyNode.fromJson({
        'name': 'n', 'type': 'ss', 'server': 'h', 'port': 99999,
        'cipher': 'aes-256-gcm', 'password': 'pw',
      }),
      throwsA(isA<FormatException>()),
    );
  });

  test('fromJson accepts boundary port 1', () {
    final n = ProxyNode.fromJson({
      'name': 'n', 'type': 'ss', 'server': 'h', 'port': 1,
      'cipher': 'aes-256-gcm', 'password': 'pw',
    });
    expect(n.port, 1);
  });

  test('fromJson accepts boundary port 65535', () {
    final n = ProxyNode.fromJson({
      'name': 'n', 'type': 'ss', 'server': 'h', 'port': 65535,
      'cipher': 'aes-256-gcm', 'password': 'pw',
    });
    expect(n.port, 65535);
  });
}
