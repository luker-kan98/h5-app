import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ProbeSelector } = require('../../proxy/probe-selector');

describe('ProbeSelector', () => {
  it('returns first probe-passing node', async () => {
    const started = [];
    const fakeSup = { startWith: async (n) => { started.push(n.name); } };
    const selector = new ProbeSelector({
      h5Url: 'https://example.com',
      supervisor: fakeSup,
      probeFn: async (n) => n.name === 'b',
    });
    const w = await selector.pick([
      { name: 'a' }, { name: 'b' }, { name: 'c' },
    ]);
    expect(w.name).toBe('b');
    expect(started).toEqual(['a', 'b']);
  });

  it('returns null when all fail', async () => {
    const selector = new ProbeSelector({
      h5Url: 'https://example.com',
      supervisor: { startWith: async () => {} },
      probeFn: async () => false,
    });
    expect(await selector.pick([{ name: 'a' }])).toBeNull();
  });

  it('handles empty node list', async () => {
    const started = [];
    const selector = new ProbeSelector({
      h5Url: 'https://example.com',
      supervisor: { startWith: async (n) => { started.push(n.name); } },
      probeFn: async () => true,
    });
    expect(await selector.pick([])).toBeNull();
    expect(started).toEqual([]);
  });

  it('probe exception treated as failure', async () => {
    const selector = new ProbeSelector({
      h5Url: 'https://example.com',
      supervisor: { startWith: async () => {} },
      probeFn: async (n) => {
        if (n.name === 'a') throw new Error('boom');
        return true;
      },
    });
    const w = await selector.pick([{ name: 'a' }, { name: 'b' }]);
    expect(w.name).toBe('b');
  });
});
