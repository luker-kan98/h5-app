import 'package:flutter_test/flutter_test.dart';
import 'package:h5_app/proxy/file_logger.dart';

void main() {
  group('ProxyFileLogger ring buffer', () {
    test('log() pushes lines into the ring tail() returns', () {
      ProxyFileLogger.instance.log('info', 'hello world');
      ProxyFileLogger.instance.log('warn', 'uh oh');
      final tail = ProxyFileLogger.instance.tail();
      expect(tail, contains('hello world'));
      expect(tail, contains('uh oh'));
      expect(tail, contains('[info]'));
      expect(tail, contains('[warn]'));
    });

    test('pLogf substitutes %s in order', () {
      // Use a sentinel that won't collide with prior test output.
      pLogf('info', 'kvp %s=%s and %s', ['k1', 'v1', 'rest']);
      final tail = ProxyFileLogger.instance.tail();
      expect(tail, contains('kvp k1=v1 and rest'));
    });

    test('pLogf passes through fmt unchanged when args is empty', () {
      pLog('info', 'no-substitution-marker-%s');
      expect(ProxyFileLogger.instance.tail(),
          contains('no-substitution-marker-%s'));
    });
  });
}
