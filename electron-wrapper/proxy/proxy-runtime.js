'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');
const { SingboxSupervisor } = require('./singbox-supervisor');
const { NodePool } = require('./node-pool');
const { ProbeSelector } = require('./probe-selector');

/**
 * Orchestrates the Electron-side proxy chain: NodePool bootstrap →
 * ProbeSelector → SingboxSupervisor → wires session.setProxy. Mirrors
 * the Dart-side ProxyRuntime (Task 20).
 */
class ProxyRuntime {
  constructor() {
    this._started = false;
    this.isHealthy = false;
    this._timer = null;
    this._savedConfig = null;
    this._savedH5Url = null;
    this._savedResourcesPath = null;
    this._savedPlatform = null;
  }

  async start({ config, h5Url, resourcesPath, platform }) {
    if (this._started) return;
    this._started = true;
    this._savedConfig = config;
    this._savedH5Url = h5Url;
    this._savedResourcesPath = resourcesPath;
    this._savedPlatform = platform;

    const cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), 'h5-proxy-'));
    const binaryName = platform === 'win32' ? 'sing-box.exe' : 'sing-box';
    const binaryPath = path.join(resourcesPath, 'singbox', binaryName);

    this.supervisor = new SingboxSupervisor({
      binaryPath,
      configDir: cacheDir,
    });
    this.pool = new NodePool({
      builtin: config.builtinProxies || [],
      ossUrls: config.ossUrls || [],
      dnsTxtDomains: config.dnsTxtDomains || [],
    });
    await this.pool.bootstrap();

    this.selector = new ProbeSelector({
      h5Url,
      supervisor: this.supervisor,
    });
    const winner = await this.selector.pick(this.pool.nodes);
    if (!winner) {
      this.isHealthy = false;
      await this.supervisor.stop();
      return;
    }
    this.isHealthy = true;
    this.attachGaveUp(this.supervisor);

    const intervalMs = (Number(config.updateIntervalHours) || 1) * 3600 * 1000;
    this._timer = setInterval(() => {
      this.pool.refresh().catch(() => { /* swallow */ });
    }, intervalMs);
  }

  /**
   * Test seam + production wiring. When the supervisor's gaveUp promise
   * resolves (sing-box exhausted its restart budget), flip isHealthy=false
   * and cancel the refresh timer so we stop spinning on a dead proxy.
   */
  attachGaveUp(supervisor) {
    if (!supervisor || !supervisor.gaveUp) return;
    const onGiveUp = () => {
      this.isHealthy = false;
      if (this._timer) { clearInterval(this._timer); this._timer = null; }
    };
    supervisor.gaveUp.then(onGiveUp, onGiveUp);
  }

  /// Tears down + retries from saved config. Used by the error page button.
  async retry() {
    const cfg = this._savedConfig;
    const url = this._savedH5Url;
    const rp = this._savedResourcesPath;
    const plat = this._savedPlatform;
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
    if (this.supervisor) {
      try { await this.supervisor.stop(); } catch (_) {}
    }
    this._started = false;
    this.isHealthy = false;
    if (cfg && url && rp && plat) {
      await this.start({ config: cfg, h5Url: url, resourcesPath: rp, platform: plat });
    }
  }

  async stop() {
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
    if (this.supervisor) {
      try { await this.supervisor.stop(); } catch (_) {}
    }
    this._started = false;
  }
}

module.exports = { ProxyRuntime };
