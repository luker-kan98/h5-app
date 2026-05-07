const { contextBridge } = require('electron');

// Unified JS bridge — same surface as the Flutter side. Default no-ops; per-SDK
// handlers (Sentry etc.) will be wired in later increments.
contextBridge.exposeInMainWorld('h5app', {
  analytics: {
    logEvent: (name, props) => {
      console.debug('[h5app.analytics.logEvent]', name, props);
    },
    setUserId: (id) => {
      console.debug('[h5app.analytics.setUserId]', id);
    },
    setUserProperty: (key, value) => {
      console.debug('[h5app.analytics.setUserProperty]', key, value);
    },
  },
  crash: {
    captureException: (err) => {
      console.debug('[h5app.crash.captureException]', err);
    },
    captureMessage: (msg) => {
      console.debug('[h5app.crash.captureMessage]', msg);
    },
  },
});
