const { app, BrowserWindow, session, ipcMain } = require('electron');
const path = require('path');

const H5_URL = '__H5_URL__';
const CUSTOM_JS = '__CUSTOM_JS__';
const SDK_CONFIGS = '__SDK_CONFIGS__';

const { ProxyRuntime } = require('./proxy/proxy-runtime');
const { errorHtml } = require('./proxy/error-page');

const proxyRuntime = new ProxyRuntime();
let mainWin = null;
let savedProxyConfig = null;

async function bootProxyIfConfigured() {
  const cfg = (typeof SDK_CONFIGS === 'object' && SDK_CONFIGS && SDK_CONFIGS.proxy)
    ? SDK_CONFIGS.proxy : null;
  if (!cfg) return;
  savedProxyConfig = cfg;
  await proxyRuntime.start({
    config: cfg,
    h5Url: H5_URL,
    resourcesPath: process.resourcesPath,
    platform: process.platform,
  });
  if (proxyRuntime.isHealthy) {
    await session.defaultSession.setProxy({ proxyRules: 'socks5://127.0.0.1:1080' });
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
  mainWin.webContents.on('did-finish-load', () => {
    if (CUSTOM_JS && CUSTOM_JS.length > 0) {
      mainWin.webContents.executeJavaScript(CUSTOM_JS).catch((err) => {
        console.error('customJs error:', err);
      });
    }
  });

  const proxyEnabled = savedProxyConfig != null;
  const disableDirect = proxyEnabled && savedProxyConfig.disableDirect === true;
  if (proxyEnabled && !proxyRuntime.isHealthy && disableDirect) {
    mainWin.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(errorHtml));
  } else {
    mainWin.loadURL(H5_URL);
  }
}

// Renderer's "重试" button calls window.electronProxyRetry(); the preload
// will be updated alongside this work to expose it via contextBridge.
ipcMain.handle('proxy:retry', async () => {
  await proxyRuntime.retry();
  if (mainWin) {
    if (proxyRuntime.isHealthy) {
      mainWin.loadURL(H5_URL);
    } else {
      mainWin.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(errorHtml));
    }
  }
});

app.whenReady()
  .then(bootProxyIfConfigured)
  .then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  proxyRuntime.stop().catch(() => {});
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
