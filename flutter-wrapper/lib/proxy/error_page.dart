/// Renders the proxy-unavailable error page with diagnostic logs inline.
///
/// `logTail` is the current ring buffer from [ProxyFileLogger]; we HTML-escape
/// it and embed it in a <pre>. Two buttons: "重试" routes through h5appBridge
/// just like before; "复制日志" reads the <pre> textContent and copies via
/// navigator.clipboard.writeText.
String renderProxyErrorHtml({
  required String logTail,
  required String logFile,
}) {
  final tail = logTail.isEmpty ? '(no logs captured)' : logTail;
  return '''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>网络不可用</title>
<style>
  body { font-family: -apple-system, sans-serif; padding: 24px; color: #333; }
  h1 { font-size: 18px; margin: 0 0 8px; text-align: center; }
  .lead { color: #666; font-size: 14px; text-align: center; margin: 0 0 16px; }
  .actions { display: flex; gap: 8px; justify-content: center; margin-bottom: 16px; flex-wrap: wrap; }
  button { padding: 10px 18px; font-size: 14px; border: 1px solid #1976d2;
           background: #1976d2; color: white; border-radius: 4px; cursor: pointer; }
  button.secondary { background: white; color: #1976d2; }
  .meta { color: #888; font-size: 11px; margin-bottom: 8px; word-break: break-all; }
  pre { background: #111; color: #ddd; padding: 12px; border-radius: 4px;
        font-size: 11px; line-height: 1.4; max-height: 60vh; overflow: auto;
        white-space: pre-wrap; word-break: break-all; }
</style>
</head>
<body>
<h1>网络不可用</h1>
<p class="lead">请检查代理配置后重试</p>
<div class="actions">
  <button onclick="window.h5appBridge && window.h5appBridge.postMessage(JSON.stringify({namespace:'proxy',method:'retry',args:[]}))">重试</button>
  <button class="secondary" onclick="copyLogs()">复制日志</button>
</div>
<div class="meta">日志文件: ${_escape(logFile)}</div>
<pre id="log">${_escape(tail)}</pre>
<script>
function copyLogs() {
  var text = document.getElementById('log').textContent;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() {
      alert('已复制');
    }).catch(function() { fallbackCopy(text); });
  } else { fallbackCopy(text); }
}
function fallbackCopy(text) {
  var ta = document.createElement('textarea');
  ta.value = text; document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); alert('已复制'); }
  catch (e) { alert('复制失败: ' + e); }
  document.body.removeChild(ta);
}
</script>
</body>
</html>
''';
}

String _escape(String s) {
  return s
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
}
