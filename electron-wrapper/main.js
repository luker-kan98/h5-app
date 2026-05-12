const { app, BrowserWindow, Menu, session, ipcMain, globalShortcut, shell } = require('electron');
const path = require('path');

const H5_URL = '__H5_URL__';
const CUSTOM_JS = '__CUSTOM_JS__';
const SDK_CONFIGS = '__SDK_CONFIGS__';

let sentry = null;
let sentryInitialized = false;
function bootSentryIfConfigured() {
  const dsn = (typeof SDK_CONFIGS === 'object' && SDK_CONFIGS && SDK_CONFIGS.sentry)
    ? SDK_CONFIGS.sentry.dsn : null;
  if (!dsn) {
    console.log('[sentry] no dsn; skipping init');
    return;
  }
  try {
    sentry = require('@sentry/electron/main');
    sentry.init({ dsn });
    sentryInitialized = true;
    console.log('[sentry] initialized');
  } catch (e) {
    console.error('[sentry] init failed:', e);
  }
}

const fileLogger = require('./proxy/file-logger');
// Install the file logger BEFORE requiring proxy modules so module-load-time
// console output (none today, but cheap insurance) and every subsequent log
// is captured to disk + an in-memory ring buffer the error page renders.
const _logApi = fileLogger.install({ logDir: app.getPath('logs') });

const { ProxyRuntime } = require('./proxy/proxy-runtime');
const { renderErrorHtml } = require('./proxy/error-page');
const { resolveReachableUrl } = require('./proxy/domain-resolver');

console.log('[boot] app start; logFile=%s', _logApi.file());

const proxyRuntime = new ProxyRuntime();
let mainWin = null;
let savedProxyConfig = null;
let resolvedH5Url = H5_URL;

function showErrorPage(win) {
  const tail = _logApi.tail();
  const html = renderErrorHtml({ logTail: tail, logFile: _logApi.file() });
  win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
}

async function bootProxyIfConfigured() {
  const cfg = (typeof SDK_CONFIGS === 'object' && SDK_CONFIGS && SDK_CONFIGS.proxy)
    ? SDK_CONFIGS.proxy : null;
  if (!cfg) {
    console.log('[proxy] no proxy config; running in direct mode');
    return;
  }
  savedProxyConfig = cfg;
  console.log('[proxy] bootProxyIfConfigured: builtin=%d ossUrls=%d dnsTxt=%d disableDirect=%s updateIntervalHours=%s',
    (cfg.builtinProxies || []).length,
    (cfg.ossUrls || []).length,
    (cfg.dnsTxtDomains || []).length,
    cfg.disableDirect === true,
    cfg.updateIntervalHours);
  try {
    await proxyRuntime.start({
      config: cfg,
      h5Url: H5_URL,
      resourcesPath: process.resourcesPath,
      platform: process.platform,
    });
  } catch (e) {
    console.error('[proxy] proxyRuntime.start threw:', e);
  }
  console.log('[proxy] bootProxy done; isHealthy=%s', proxyRuntime.isHealthy);
  if (proxyRuntime.isHealthy) {
    try {
      await session.defaultSession.setProxy({ proxyRules: 'socks5://127.0.0.1:1080' });
      console.log('[proxy] session.setProxy → socks5://127.0.0.1:1080');
    } catch (e) {
      console.error('[proxy] session.setProxy failed:', e);
    }
  }
}

async function resolveH5UrlIfConfigured() {
  const domainConfigUrls = savedProxyConfig && Array.isArray(savedProxyConfig.domainConfigUrls)
    ? savedProxyConfig.domainConfigUrls
    : [];
  if (domainConfigUrls.length === 0) {
    console.log('[domain-resolver] skipped (no domainConfigUrls)');
    return;
  }
  console.log('[domain-resolver] resolving against %d config URL(s)', domainConfigUrls.length);
  try {
    resolvedH5Url = await resolveReachableUrl({
      originalUrl: H5_URL,
      domainConfigUrls,
    });
    console.log('[domain-resolver] resolved →', resolvedH5Url);
  } catch (e) {
    console.warn('[domain-resolver] unexpected error', e);
  }
}

function createWindow() {
  mainWin = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Auto-open DevTools so the user can see network errors immediately.
  // (Cmd+Opt+I / Ctrl+Shift+I also toggle it via the application menu below.)
  mainWin.webContents.openDevTools({ mode: 'detach' });

  mainWin.webContents.on('did-finish-load', () => {
    console.log('[webview] did-finish-load url=%s', mainWin.webContents.getURL());
    if (CUSTOM_JS && CUSTOM_JS.length > 0) {
      mainWin.webContents.executeJavaScript(CUSTOM_JS).catch((err) => {
        console.error('customJs error:', err);
      });
    }
  });
  mainWin.webContents.on('did-fail-load', (_e, errorCode, errorDescription, validatedURL, isMainFrame) => {
    console.error('[webview] did-fail-load code=%d desc=%s url=%s mainFrame=%s',
      errorCode, errorDescription, validatedURL, isMainFrame);
  });
  mainWin.webContents.on('render-process-gone', (_e, details) => {
    console.error('[webview] render-process-gone', details);
  });

  const proxyEnabled = savedProxyConfig != null;
  const disableDirect = proxyEnabled && savedProxyConfig.disableDirect === true;
  if (proxyEnabled && !proxyRuntime.isHealthy && disableDirect) {
    console.warn('[webview] proxy unhealthy AND disableDirect=true → showing error page');
    showErrorPage(mainWin);
  } else {
    console.log('[webview] loading url=%s (proxyEnabled=%s healthy=%s)',
      resolvedH5Url, proxyEnabled, proxyRuntime.isHealthy);
    mainWin.loadURL(resolvedH5Url);
  }
}

function buildAppMenu() {
  // Restore the standard application menu *plus* a guaranteed Toggle DevTools
  // accelerator so users have a discoverable shortcut on every platform.
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac ? [{ role: 'appMenu' }] : []),
    { role: 'fileMenu' },
    { role: 'editMenu' },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        {
          label: 'Toggle DevTools',
          accelerator: isMac ? 'Cmd+Alt+I' : 'Ctrl+Shift+I',
          click: () => {
            const win = BrowserWindow.getFocusedWindow() || mainWin;
            if (win) win.webContents.toggleDevTools();
          },
        },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    { role: 'windowMenu' },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// Renderer's "重试" button calls window.electronProxyRetry(); the preload
// will be updated alongside this work to expose it via contextBridge.
ipcMain.handle('proxy:retry', async () => {
  await proxyRuntime.retry();
  if (mainWin) {
    if (proxyRuntime.isHealthy) {
      mainWin.loadURL(resolvedH5Url);
    } else {
      showErrorPage(mainWin);
    }
  }
});

ipcMain.handle('proxy:openLogs', () => {
  const file = _logApi.file();
  if (file) shell.showItemInFolder(file);
});

ipcMain.handle('sentry:captureException', (_e, payload) => {
  if (!sentryInitialized || !sentry) return false;
  const msg = (payload && payload.message) || '(no message)';
  const stack = (payload && payload.stack) || '';
  const err = new Error(msg);
  if (stack) err.stack = stack;
  sentry.captureException(err);
  return true;
});

ipcMain.handle('sentry:captureMessage', (_e, msg) => {
  if (!sentryInitialized || !sentry) return false;
  sentry.captureMessage(String(msg || ''));
  return true;
});

app.whenReady()
  .then(() => {
    buildAppMenu();
    // Belt-and-suspenders: a global shortcut so DevTools opens even if
    // focus is on a non-menu surface or the menu was suppressed.
    const accel = process.platform === 'darwin' ? 'Cmd+Alt+I' : 'Ctrl+Shift+I';
    globalShortcut.register(accel, () => {
      const win = BrowserWindow.getFocusedWindow() || mainWin;
      if (win) win.webContents.toggleDevTools();
    });
  })
  .then(bootSentryIfConfigured)
  .then(bootProxyIfConfigured)
  .then(resolveH5UrlIfConfigured)
  .then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('before-quit', () => {
  proxyRuntime.stop().catch(() => {});
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
