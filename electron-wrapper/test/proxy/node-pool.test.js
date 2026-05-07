import { describe, it, expect, vi } from 'vitest';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { NodePool } = require('../../proxy/node-pool');

describe('NodePool', () => {
  it('built-in nodes available immediately', async () => {
    const pool = new NodePool({
      builtin: [{ name: 'b', type: 'ss', server: 'h', port: 1, cipher: 'aes-256-gcm', password: 'pw' }],
      ossUrls: [],
      dnsTxtDomains: [],
      fetchFn: vi.fn(),
    });
    await pool.bootstrap();
    expect(pool.nodes).toHaveLength(1);
    expect(pool.nodes[0].name).toBe('b');
  });

  it('OSS fetch parses proxies array, priority order = built-in then oss', async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        proxies: [{ name: 'oss1', type: 'ss', server: 'o', port: 2, cipher: 'aes-256-gcm', password: 'pw' }],
      }),
    });
    const pool = new NodePool({
      builtin: [{ name: 'b', type: 'ss', server: 'h', port: 1, cipher: 'aes-256-gcm', password: 'pw' }],
      ossUrls: ['https://oss.example.com/c.json'],
      dnsTxtDomains: [],
      fetchFn,
    });
    await pool.bootstrap();
    expect(pool.nodes.map(n => n.name)).toEqual(['b', 'oss1']);
  });

  it('OSS failure does not block; previous pool retained', async () => {
    let calls = 0;
    const fetchFn = vi.fn().mockImplementation(async () => {
      calls++;
      if (calls === 1) {
        return { ok: true, json: async () => ({
          proxies: [{ name: 'oss1', type: 'ss', server: 'o', port: 2, cipher: 'aes-256-gcm', password: 'pw' }],
        }) };
      }
      return { ok: false, status: 500 };
    });
    const pool = new NodePool({
      builtin: [],
      ossUrls: ['https://oss.example.com/c.json'],
      dnsTxtDomains: [],
      fetchFn,
    });
    await pool.bootstrap();
    expect(pool.nodes).toHaveLength(1);
    await pool.refresh();
    expect(pool.nodes).toHaveLength(1);
  });

  it('DoH TXT discovery decodes ss:// URI', async () => {
    const fetchFn = vi.fn().mockImplementation(async (url) => {
      if (String(url).includes('1.1.1.1')) {
        return {
          ok: true,
          json: async () => ({
            Status: 0,
            Answer: [{
              name: 'fallback.example.com', type: 16, TTL: 300,
              data: '"ss://YWVzLTI1Ni1nY206ZG9oLXB3@1.2.3.4:8388#fallback"',
            }],
          }),
        };
      }
      return { ok: false, status: 404 };
    });
    const pool = new NodePool({
      builtin: [],
      ossUrls: [],
      dnsTxtDomains: ['fallback.example.com'],
      fetchFn,
    });
    await pool.bootstrap();
    expect(pool.nodes).toHaveLength(1);
    expect(pool.nodes[0].name).toBe('fallback');
    expect(pool.nodes[0].server).toBe('1.2.3.4');
    expect(pool.nodes[0].port).toBe(8388);
  });
});
