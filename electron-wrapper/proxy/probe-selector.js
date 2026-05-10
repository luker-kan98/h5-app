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
    console.log('[probe] pick start: %d candidate node(s) for %s', nodes.length, this.h5Url);
    for (const node of nodes) {
      console.log('[probe] trying node name=%s server=%s:%d', node.name, node.server, node.port);
      await this.supervisor.startWith(node);
      await new Promise(r => setTimeout(r, 200));
      try {
        const ok = await this._probe(node, this.h5Url);
        console.log('[probe] result for %s: %s', node.name, ok ? 'OK' : 'FAIL');
        if (ok) return node;
      } catch (e) {
        console.warn('[probe] threw for %s:', node.name, e && e.message ? e.message : e);
      }
    }
    console.error('[probe] no node passed probe — pool exhausted');
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
      console.log('[probe] HTTP %d via socks5 for %s', res.statusCode, url.hostname);
      resolve(res.statusCode >= 200 && res.statusCode < 400);
      res.resume();
    });
    req.on('error', (err) => {
      console.warn('[probe] error via socks5 for %s: %s', url.hostname, err.message);
      resolve(false);
    });
    req.on('timeout', () => {
      console.warn('[probe] timeout via socks5 for %s', url.hostname);
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

module.exports = { ProbeSelector };
