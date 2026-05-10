import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs');
const os = require('os');
const path = require('path');

const ORIG = {};
for (const lvl of ['log', 'info', 'warn', 'error', 'debug']) ORIG[lvl] = console[lvl];

function restoreConsole() {
  for (const lvl of Object.keys(ORIG)) console[lvl] = ORIG[lvl];
}

function freshLogger() {
  const p = require.resolve('../../proxy/file-logger');
  delete require.cache[p];
  return require('../../proxy/file-logger');
}

describe('file-logger', () => {
  let tmpDir;
  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'flog-'));
  });
  afterEach(() => {
    restoreConsole();
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
  });

  it('writes console output to the log file and to the in-memory tail', () => {
    const logger = freshLogger();
    const api = logger.install({ logDir: tmpDir, fileName: 'a.log' });
    console.log('hello %s', 'world');
    console.warn('uh oh');
    const text = fs.readFileSync(path.join(tmpDir, 'a.log'), 'utf8');
    expect(text).toContain('hello world');
    expect(text).toContain('uh oh');
    expect(api.tail()).toContain('hello world');
    expect(api.tail()).toContain('uh oh');
  });

  it('still calls the original console fn so terminal/devtools see output', () => {
    const captured = [];
    console.log = (...args) => captured.push(args.join(' '));
    const logger = freshLogger();
    logger.install({ logDir: tmpDir, fileName: 'b.log' });
    console.log('passthrough');
    expect(captured.some(line => line.includes('passthrough'))).toBe(true);
  });

  it('returns the same api on repeated install (no double-tee)', () => {
    const logger = freshLogger();
    logger.install({ logDir: tmpDir, fileName: 'c.log' });
    logger.install({ logDir: tmpDir, fileName: 'c.log' });
    console.log('once');
    const text = fs.readFileSync(path.join(tmpDir, 'c.log'), 'utf8');
    const matches = text.match(/once/g) || [];
    expect(matches.length).toBe(1);
  });
});
