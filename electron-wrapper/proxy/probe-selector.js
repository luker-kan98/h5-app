'use strict';

const https = require('https');
const http = require('http');
const { SocksProxyAgent } = require('socks-proxy-agent');

/**
 * Walks an ordered list of proxy nodes, asking the supervisor to start
 * each in turn, then probing the H5 URL through the local SOCKS5 inbound.
 * Returns the first node whose probe succeeds, or null if all fail.
 *
 * Probe failures (return false OR throw) both fall through to the next
 * node — callers cannot distinguish "probe ran, returned false" from
 * "probe blew up", which is fine for failover.
 */
class ProbeSelector {
  constructor({ h5Url, supervisor, probeFn }) {
    this.h5Url = h5Url;
    this.supervisor = supervisor;
    this._probe = probeFn || defaultProbe;
  }

  async pick(nodes) {
    for (const node of nodes) {
      await this.supervisor.startWith(node);
      // Brief delay so sing-box has time to bind sockets in production.
      // Tests inject a synthetic probe so this is paid only in real runs.
      await new Promise(r => setTimeout(r, 200));
      try {
        if (await this._probe(node, this.h5Url)) return node;
      } catch (_) {
        // probe failure is non-fatal; try the next node
      }
    }
    return null;
  }
}

function defaultProbe(_node, h5Url) {
  return new Promise((resolve) => {
    const agent = new SocksProxyAgent('socks5://127.0.0.1:1080');
    const url = new URL(h5Url);
    const lib = url.protocol === 'https:' ? https : http;
    const req = lib.request({
      method: 'HEAD',
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      agent,
      timeout: 5000,
    }, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
      res.resume();
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.end();
  });
}

module.exports = { ProbeSelector };
