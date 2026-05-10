'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');

const MAX_BYTES = 1_000_000;
const RING_LINES = 500;

/**
 * Tees console.{log,info,warn,error,debug} into a file AND keeps an in-memory
 * tail. The tail is what the error page shows so the user can read why
 * "网络不可用" without opening DevTools. On macOS-LaunchServices launches
 * (double-click from Finder) stdout is /dev/null, so the file is the only
 * durable record.
 */

let _file = null;
let _ring = [];
let _installed = false;

function install({ logDir, fileName = 'h5-app.log' }) {
  if (_installed) return getApi();
  _installed = true;
  try {
    fs.mkdirSync(logDir, { recursive: true });
  } catch (_) { /* best-effort */ }
  _file = path.join(logDir, fileName);

  rotateIfTooBig();
  appendLine(`---- session start ${new Date().toISOString()} ----`);

  for (const level of ['log', 'info', 'warn', 'error', 'debug']) {
    const orig = console[level].bind(console);
    console[level] = (...args) => {
      const line = `[${new Date().toISOString()}] [${level}] ${util.format(...args)}`;
      try { orig(...args); } catch (_) { /* swallow */ }
      pushRing(line);
      appendLine(line);
    };
  }
  return getApi();
}

function pushRing(line) {
  _ring.push(line);
  if (_ring.length > RING_LINES) _ring.shift();
}

function appendLine(line) {
  if (!_file) return;
  try { fs.appendFileSync(_file, line + '\n'); } catch (_) { /* full disk etc. */ }
}

function rotateIfTooBig() {
  if (!_file) return;
  try {
    const st = fs.statSync(_file);
    if (st.size > MAX_BYTES) fs.renameSync(_file, _file + '.1');
  } catch (_) { /* file does not exist yet */ }
}

function getApi() {
  return {
    file: () => _file,
    tail: (n = RING_LINES) => _ring.slice(-n).join('\n'),
  };
}

module.exports = { install };
