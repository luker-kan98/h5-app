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
    this._cacheDir = null;
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
    this._cacheDir = cacheDir;
    const binaryName = platform === 'win32' ? 'sing-box.exe' : 'sing-box';
    const binaryPath = path.join(resourcesPath, 'singbox', binaryName);
    console.log('[proxy-runtime] start platform=%s cacheDir=%s binary=%s exists=%s',
      platform, cacheDir, binaryPath, fs.existsSync(binaryPath));

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
    console.log('[proxy-runtime] pool bootstrap done; nodes=%d', this.pool.nodes.length);

    this.selector = new ProbeSelector({
      h5Url,
      supervisor: this.supervisor,
    });
    const winner = await this.selector.pick(this.pool.nodes);
    if (!winner) {
      console.error('[proxy-runtime] no healthy node — proxy disabled');
      this.isHealthy = false;
      await this.supervisor.stop();
      return;
    }
    console.log('[proxy-runtime] winner=%s', winner.name);
    this.isHealthy = true;
    this.attachGaveUp(this.supervisor);

    const intervalMs = (Number(config.updateIntervalHours) || 1) * 3600 * 1000;
    this._timer = setInterval(() => {
      console.log('[proxy-runtime] periodic pool refresh (every %d ms)', intervalMs);
      this.pool.refresh().catch((e) => console.warn('[proxy-runtime] refresh threw:', e));
    }, intervalMs);
  }

  /**
   * Test seam + production wiring. When the supervisor's gaveUp promise
   * resolves (sing-box exhausted its restart budget), flip isHealthy=false
   * and cancel the refresh timer so we stop spinning on a dead proxy.
   */
  attachGaveUp(supervisor) {
    if (!supervisor || !supervisor.gaveUp) return;
    const onGiveUp = (err) => {
      console.warn('[proxy-runtime] supervisor gaveUp%s — flipping isHealthy=false',
        err ? ' (error: ' + (err.message || err) + ')' : '');
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
    await this.stop();
    if (cfg && url && rp && plat) {
      await this.start({ config: cfg, h5Url: url, resourcesPath: rp, platform: plat });
    }
  }

  async stop() {
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
    if (this.supervisor) {
      try { await this.supervisor.stop(); } catch (_) {}
    }
    if (this._cacheDir) {
      try { fs.rmSync(this._cacheDir, { recursive: true, force: true }); } catch (_) {}
      this._cacheDir = null;
    }
    this._started = false;
  }
}

module.exports = { ProxyRuntime };
