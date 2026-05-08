import { describe, it, expect } from 'vitest';
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
    await new Promise(r => setImmediate(r));
    expect(rt.isHealthy).toBe(false);
    expect(rt._timer).toBeNull();
  });
});
