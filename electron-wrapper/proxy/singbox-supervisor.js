'use strict';

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const SOCKS_PORT = 1080;
const HTTP_PORT = 1081;
const MAX_RESTARTS_PER_MINUTE = 3;

/**
 * Owns the sing-box subprocess. Writes config JSON, spawns the binary, and
 * restarts on crash. Mirrors the Dart-side SingboxSupervisor (Task 16):
 * 1 initial start + 3 restarts in a rolling 60s window before giving up.
 */
class SingboxSupervisor {
  constructor({ binaryPath, configDir, spawnFn }) {
    this.binaryPath = binaryPath;
    this.configDir = configDir;
    this._spawn = spawnFn || child_process.spawn;
    this._currentNode = null;
    this._proc = null;
    this._recentStarts = [];
    this._stopped = false;
    this.socksAddress = `127.0.0.1:${SOCKS_PORT}`;
    this.httpAddress = `127.0.0.1:${HTTP_PORT}`;
    this._gaveUpResolve = null;
    this._gaveUpReject = null;
    this.gaveUp = new Promise((resolve, reject) => {
      this._gaveUpResolve = resolve;
      this._gaveUpReject = reject;
    });
  }

  async startWith(node) {
    this._currentNode = node;
    await this._spawnOne();
  }

  async _spawnOne() {
    if (this._stopped) return;
    if (this._proc) {
      try { this._proc.removeAllListeners('exit'); } catch (_) { /* swallow */ }
      try { this._proc.kill(); } catch (_) { /* swallow */ }
      this._proc = null;
    }
    const cfgPath = path.join(this.configDir, 'singbox-config.json');
    fs.writeFileSync(cfgPath, this._renderConfig(this._currentNode), { mode: 0o600 });
    if (process.platform !== 'win32') {
      try { fs.chmodSync(cfgPath, 0o600); } catch (_) { /* best-effort */ }
    }
    this._recentStarts.push(Date.now());

    const node = this._currentNode || {};
    console.log('[sing-box] spawn binary=%s cfg=%s node=%s server=%s:%d cipher=%s',
      this.binaryPath, cfgPath, node.name, node.server, node.port, node.cipher);

    const proc = this._spawn(this.binaryPath, ['run', '-c', cfgPath]);
    this._proc = proc;
    if (proc && proc.stdout && typeof proc.stdout.on === 'function') {
      proc.stdout.on('data', (chunk) => {
        process.stdout.write('[sing-box stdout] ' + chunk.toString());
      });
    }
    if (proc && proc.stderr && typeof proc.stderr.on === 'function') {
      proc.stderr.on('data', (chunk) => {
        process.stderr.write('[sing-box stderr] ' + chunk.toString());
      });
    }
    if (proc && typeof proc.on === 'function') {
      proc.on('error', (err) => {
        console.error('[sing-box] spawn error:', err);
      });
    }
    proc.on('exit', (code, signal) => {
      console.warn('[sing-box] exit code=%s signal=%s stopped=%s', code, signal, this._stopped);
      if (this._stopped) return;
      this._onExit();
    });
  }

  _onExit() {
    const now = Date.now();
    this._recentStarts = this._recentStarts.filter(t => now - t < 60_000);
    console.warn('[sing-box] _onExit; restarts in last 60s=%d (limit=%d)',
      this._recentStarts.length, MAX_RESTARTS_PER_MINUTE + 1);
    if (this._recentStarts.length >= MAX_RESTARTS_PER_MINUTE + 1) {
      console.error('[sing-box] restart budget exhausted → gaveUp');
      if (this._gaveUpResolve) {
        this._gaveUpResolve();
        this._gaveUpResolve = null;
        this._gaveUpReject = null;
      }
      return;
    }
    console.log('[sing-box] respawning…');
    this._spawnOne().catch(err => {
      console.error('[sing-box] respawn failed:', err);
      if (this._gaveUpReject) {
        this._gaveUpReject(err);
        this._gaveUpResolve = null;
        this._gaveUpReject = null;
      }
    });
  }

  _renderConfig(n) {
    return JSON.stringify({
      log: { level: 'info', disabled: false, timestamp: true },
      inbounds: [
        { type: 'socks', tag: 'socks-in', listen: '127.0.0.1', listen_port: SOCKS_PORT },
        { type: 'http', tag: 'http-in', listen: '127.0.0.1', listen_port: HTTP_PORT },
      ],
      outbounds: [
        {
          type: 'shadowsocks',
          tag: 'proxy-out',
          server: n.server,
          server_port: n.port,
          method: n.cipher,
          password: n.password,
        },
      ],
    }, null, 2);
  }

  async stop() {
    this._stopped = true;
    if (this._proc) {
      try { this._proc.removeAllListeners('exit'); } catch (_) { /* swallow */ }
      try { this._proc.kill(); } catch (_) { /* swallow */ }
      this._proc = null;
    }
    // Resolve gaveUp so any .then() handlers attached via attachGaveUp run
    // once and release their closures. Otherwise the Promise stays pending
    // forever and across retry() cycles each ProxyRuntime accumulates one
    // dangling handler per discarded supervisor (slow leak).
    if (this._gaveUpResolve) {
      this._gaveUpResolve();
      this._gaveUpResolve = null;
      this._gaveUpReject = null;
    }
  }
}

module.exports = { SingboxSupervisor };
