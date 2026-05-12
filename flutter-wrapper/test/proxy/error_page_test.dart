import 'package:flutter_test/flutter_test.dart';
import 'package:h5_app/proxy/error_page.dart';

void main() {
  group('renderProxyErrorHtml', () {
    test('embeds the log tail with HTML escaped', () {
      final html = renderProxyErrorHtml(
        logTail: 'oops <script>alert(1)</script> & end',
        logFile: '/tmp/h5-proxy.log',
      );
      expect(
        html,
        contains('oops &lt;script&gt;alert(1)&lt;/script&gt; &amp; end'),
      );
      expect(html, isNot(contains('<script>alert(1)</script>')));
    });

    test('escapes the log file path so it cannot break out', () {
      final html = renderProxyErrorHtml(
        logTail: '',
        logFile: '"/tmp/<x>.log',
      );
      expect(html, contains('&quot;/tmp/&lt;x&gt;.log'));
    });

    test('shows a fallback when logTail is empty', () {
      final html =
          renderProxyErrorHtml(logTail: '', logFile: '/tmp/h5-proxy.log');
      expect(html, contains('(no logs captured)'));
    });

    test('exposes a 重试 button wired to h5appBridge', () {
      final html = renderProxyErrorHtml(logTail: '', logFile: '');
      expect(html, contains('h5appBridge'));
      expect(html, contains('重试'));
      expect(html, contains("namespace:'proxy',method:'retry'"));
    });

    test('exposes a 复制日志 button wired to clipboard', () {
      final html = renderProxyErrorHtml(logTail: '', logFile: '');
      expect(html, contains('复制日志'));
      expect(html, contains('navigator.clipboard'));
    });
  });
}
