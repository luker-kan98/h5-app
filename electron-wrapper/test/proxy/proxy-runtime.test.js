import { describe, it, expect } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { ProxyRuntime } from '../../proxy/proxy-runtime.js';

describe('ProxyRuntime gaveUp wiring', () => {
  it('flips isHealthy=false when supervisor gives up', async () => {
    const rt = new ProxyRuntime();
    let resolveGaveUp;
    const gaveUp = new Promise(r => { resolveGaveUp = r; });
    rt.isHealthy = true;
    rt._timer = setInterval(() => {}, 1_000_000);
    rt.attachGaveUp({ gaveUp });
    resolveGaveUp();
    await Promise.resolve();
    await Promise.resolve();
    expect(rt.isHealthy).toBe(false);
    expect(rt._timer).toBeNull();
  });
});

describe('ProxyRuntime tempdir cleanup', () => {
  it('removes the cacheDir on stop()', async () => {
    const rt = new ProxyRuntime();
    // Manually pre-populate _cacheDir to simulate a started runtime
    // without exercising the full start() chain (which needs a real binary).
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'h5-proxy-test-'));
    rt._cacheDir = dir;
    rt._started = true;
    await rt.stop();
    expect(fs.existsSync(dir)).toBe(false);
  });

  it('stop() is safe when no cacheDir was set', async () => {
    const rt = new ProxyRuntime();
    await rt.stop();  // must not throw
    expect(rt._started).toBe(false);
  });
});
