const String proxyErrorHtml = '''
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>网络不可用</title>
<style>
  body { font-family: -apple-system, sans-serif; padding: 40px; text-align: center; color: #333; }
  h1 { font-size: 18px; margin-bottom: 8px; }
  p { color: #666; font-size: 14px; }
  button { margin-top: 24px; padding: 10px 24px; font-size: 14px;
           border: 1px solid #1976d2; background: #1976d2; color: white;
           border-radius: 4px; cursor: pointer; }
</style>
</head>
<body>
<h1>网络不可用</h1>
<p>请检查代理配置后重试</p>
<button onclick="window.h5appBridge && window.h5appBridge.postMessage(JSON.stringify({namespace:'proxy',method:'retry',args:[]}))">重试</button>
</body>
</html>
''';
