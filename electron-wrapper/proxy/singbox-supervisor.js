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
    const cfgPath = path.join(this.configDir, 'singbox-config.json');
    fs.writeFileSync(cfgPath, this._renderConfig(this._currentNode));
    this._recentStarts.push(Date.now());

    const proc = this._spawn(this.binaryPath, ['run', '-c', cfgPath]);
    this._proc = proc;
    proc.on('exit', () => {
      if (this._stopped) return;
      this._onExit();
    });
  }

  _onExit() {
    const now = Date.now();
    this._recentStarts = this._recentStarts.filter(t => now - t < 60_000);
    if (this._recentStarts.length >= MAX_RESTARTS_PER_MINUTE + 1) {
      this._gaveUpResolve();
      return;
    }
    // Fire-and-forget restart; surface spawn errors through gaveUp.
    this._spawnOne().catch(err => {
      this._gaveUpReject(err);
    });
  }

  _renderConfig(n) {
    return JSON.stringify({
      log: { level: 'warn', disabled: false },
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
    try {
      if (this._proc && this._proc.kill) this._proc.kill();
    } catch (_) { /* swallow */ }
  }
}

module.exports = { SingboxSupervisor };
