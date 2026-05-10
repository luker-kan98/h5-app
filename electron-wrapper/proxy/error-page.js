'use strict';

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderErrorHtml({ logTail = '', logFile = '' } = {}) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>网络不可用</title>
<style>
  body { font-family: -apple-system, sans-serif; padding: 32px; color: #333; }
  .center { text-align: center; }
  h1 { font-size: 18px; margin-bottom: 8px; }
  p { color: #666; font-size: 14px; }
  .row { margin-top: 18px; }
  button { padding: 8px 18px; font-size: 13px; margin: 0 6px;
           border: 1px solid #1976d2; background: #1976d2; color: white;
           border-radius: 4px; cursor: pointer; }
  button.secondary { background: #fff; color: #1976d2; }
  pre { margin-top: 24px; padding: 12px; background: #1e1e1e; color: #d4d4d4;
        font-size: 12px; line-height: 1.5; max-height: 60vh; overflow: auto;
        border-radius: 4px; white-space: pre-wrap; word-break: break-all; }
  .meta { margin-top: 8px; font-size: 12px; color: #888; word-break: break-all; }
</style></head>
<body>
  <div class="center">
    <h1>网络不可用</h1>
    <p>请检查代理配置后重试</p>
    <div class="row">
      <button onclick="window.electronProxyRetry && window.electronProxyRetry()">重试</button>
      <button class="secondary" onclick="window.electronOpenLogs && window.electronOpenLogs()">打开日志目录</button>
      <button class="secondary" onclick="(async()=>{try{await navigator.clipboard.writeText(document.getElementById('log').textContent);this.textContent='已复制';}catch(e){this.textContent='复制失败';}})()">复制日志</button>
    </div>
    <div class="meta">日志文件：${escapeHtml(logFile)}</div>
  </div>
  <pre id="log">${escapeHtml(logTail || '(no logs captured)')}</pre>
</body></html>`;
}

module.exports = { renderErrorHtml };
