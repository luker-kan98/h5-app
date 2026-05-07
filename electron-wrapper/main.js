const { app, BrowserWindow } = require('electron');
const path = require('path');

const H5_URL = '__H5_URL__';
const CUSTOM_JS = '__CUSTOM_JS__';
const SDK_CONFIGS = '__SDK_CONFIGS__';

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  win.webContents.on('did-finish-load', () => {
    if (CUSTOM_JS && CUSTOM_JS.length > 0) {
      win.webContents.executeJavaScript(CUSTOM_JS).catch((err) => {
        console.error('customJs error:', err);
      });
    }
  });
  win.loadURL(H5_URL);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// SDK_CONFIGS is reserved for future per-SDK init (Sentry main-process init etc.)
void SDK_CONFIGS;
