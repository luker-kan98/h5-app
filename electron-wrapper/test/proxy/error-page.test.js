import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { renderErrorHtml } = require('../../proxy/error-page');

describe('renderErrorHtml', () => {
  it('embeds the log tail verbatim with HTML escaped', () => {
    const html = renderErrorHtml({
      logTail: 'oops <script>alert(1)</script> & end',
      logFile: '/tmp/h5-app.log',
    });
    expect(html).toContain('oops &lt;script&gt;alert(1)&lt;/script&gt; &amp; end');
    expect(html).not.toContain('<script>alert(1)</script>');
  });

  it('escapes the log file path so it cannot break out of the meta div', () => {
    const html = renderErrorHtml({ logTail: '', logFile: '"/tmp/<x>.log' });
    expect(html).toContain('&quot;/tmp/&lt;x&gt;.log');
  });

  it('shows a fallback when logTail is empty', () => {
    const html = renderErrorHtml({ logTail: '', logFile: '/tmp/h5-app.log' });
    expect(html).toContain('(no logs captured)');
  });

  it('exposes a 重试 button wired to electronProxyRetry', () => {
    const html = renderErrorHtml({});
    expect(html).toContain('window.electronProxyRetry');
    expect(html).toContain('重试');
  });

  it('exposes a 打开日志目录 button wired to electronOpenLogs', () => {
    const html = renderErrorHtml({});
    expect(html).toContain('window.electronOpenLogs');
    expect(html).toContain('打开日志目录');
  });
});
