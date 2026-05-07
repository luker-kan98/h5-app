'use strict';

/**
 * Defensive validator for ProxyNode-shaped objects fetched from OSS at
 * runtime. The backend already normalizes builtinProxies before injection,
 * but OSS responses are foreign data — must be validated before use.
 *
 * Returns a normalized ProxyNode object on success; throws TypeError on
 * any shape problem.
 */
function validateNode(o) {
  if (!o || typeof o !== 'object') {
    throw new TypeError('node must be object');
  }
  for (const key of ['name', 'type', 'server', 'port', 'cipher', 'password']) {
    if (!(key in o)) {
      throw new TypeError(`node missing field ${key}`);
    }
  }
  if (o.type !== 'ss') {
    throw new TypeError(`unsupported type ${o.type}`);
  }
  const port = typeof o.port === 'string' ? parseInt(o.port, 10) : o.port;
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new TypeError(`port out of range: ${o.port}`);
  }
  return {
    name: String(o.name || `${o.server}:${port}`),
    type: 'ss',
    server: String(o.server),
    port,
    cipher: String(o.cipher),
    password: String(o.password),
    udp: Boolean(o.udp),
  };
}

module.exports = { validateNode };
