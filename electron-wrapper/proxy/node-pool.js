'use strict';

const { validateNode } = require('./proxy-node');

const FETCH_TIMEOUT_MS = 5000;

/**
 * Maintains an in-memory list of ProxyNodes from three sources:
 *   1. built-in (compile-time, injected via __SDK_CONFIGS__)
 *   2. OSS configs (HTTP fetch, parallel, 5s timeout, failure non-fatal)
 *   3. DNS TXT records resolved via DoH (Cloudflare 1.1.1.1)
 *
 * Priority order in `nodes`: built-in first, then OSS (in argument order),
 * then DoH (in argument order). On a refresh that returns an empty merged
 * pool but the previous pool was non-empty, the previous pool is retained.
 */
class NodePool {
  constructor({ builtin, ossUrls, dnsTxtDomains, fetchFn }) {
    this.builtin = builtin || [];
    this.ossUrls = ossUrls || [];
    this.dnsTxtDomains = dnsTxtDomains || [];
    this._fetch = fetchFn || globalThis.fetch;
    this._nodes = [...this.builtin];
  }

  get nodes() { return [...this._nodes]; }

  async bootstrap() { await this.refresh(); }

  async refresh() {
    const oss = await this._gatherOss();
    const txt = await this._gatherDnsTxt();
    const merged = [...this.builtin, ...oss, ...txt];
    if (merged.length === 0 && this._nodes.length > 0) return;
    this._nodes = merged;
  }

  async _gatherOss() {
    const out = [];
    await Promise.all(this.ossUrls.map(async (url) => {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
        const resp = await this._fetch(url, { signal: ctrl.signal });
        clearTimeout(t);
        if (!resp.ok) return;
        const data = await resp.json();
        for (const raw of (data.proxies || [])) {
          try { out.push(validateNode(raw)); } catch (_) { /* drop bad entries */ }
        }
      } catch (_) { /* swallow per-URL failure */ }
    }));
    return out;
  }

  async _gatherDnsTxt() {
    const out = [];
    await Promise.all(this.dnsTxtDomains.map(async (domain) => {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
        const resp = await this._fetch(
          `https://1.1.1.1/dns-query?name=${encodeURIComponent(domain)}&type=TXT`,
          { headers: { 'Accept': 'application/dns-json' }, signal: ctrl.signal },
        );
        clearTimeout(t);
        if (!resp.ok) return;
        const data = await resp.json();
        for (const ans of (data.Answer || [])) {
          const raw = String(ans.data || '').replace(/"/g, '').trim();
          if (!raw.startsWith('ss://')) continue;
          const node = parseSsUri(raw);
          if (node) out.push(node);
        }
      } catch (_) { /* swallow */ }
    }));
    return out;
  }
}

/**
 * Minimal ss://BASE64(method:password)@host:port[#name] parser for DoH-
 * discovered nodes. Mirrors the Dart side; only supports the SIP002 base
 * format (no ?plugin=, which the backend rejects anyway).
 */
function parseSsUri(uri) {
  try {
    const body = uri.slice('ss://'.length);
    const hashIdx = body.indexOf('#');
    let name = '';
    let rest = body;
    if (hashIdx >= 0) {
      name = decodeURIComponent(body.slice(hashIdx + 1));
      rest = body.slice(0, hashIdx);
    }
    const atIdx = rest.lastIndexOf('@');
    if (atIdx < 0) return null;
    const userinfo = rest.slice(0, atIdx);
    const hostport = rest.slice(atIdx + 1);
    const colonIdx = hostport.lastIndexOf(':');
    const host = hostport.slice(0, colonIdx);
    const port = parseInt(hostport.slice(colonIdx + 1), 10);
    const padded = userinfo + '='.repeat((4 - userinfo.length % 4) % 4);
    const decoded = Buffer.from(
      padded.replace(/-/g, '+').replace(/_/g, '/'),
      'base64',
    ).toString('utf8');
    const partIdx = decoded.indexOf(':');
    if (partIdx < 0) return null;
    return validateNode({
      name: name || `${host}:${port}`,
      type: 'ss',
      server: host,
      port,
      cipher: decoded.slice(0, partIdx),
      password: decoded.slice(partIdx + 1),
    });
  } catch (_) {
    return null;
  }
}

module.exports = { NodePool };
