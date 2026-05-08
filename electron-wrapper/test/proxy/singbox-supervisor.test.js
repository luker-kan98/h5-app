import { describe, it, expect } from 'vitest';
import sinon from 'sinon';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { EventEmitter } from 'events';
import { SingboxSupervisor } from '../../proxy/singbox-supervisor.js';

function fakeSpawn() {
  const ee = new EventEmitter();
  ee.kill = sinon.fake();
  ee.pid = 1;
  return ee;
}

describe('SingboxSupervisor', () => {
  it('writes config before spawn', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sup-'));
    const spawn = sinon.fake.returns(fakeSpawn());
    const sup = new SingboxSupervisor({
      binaryPath: '/fake', configDir: dir, spawnFn: spawn,
    });
    await sup.startWith({
      name: 'n', type: 'ss', server: 'h', port: 1,
      cipher: 'aes-256-gcm', password: 'pw', udp: false,
    });
    const cfgPath = path.join(dir, 'singbox-config.json');
    expect(fs.existsSync(cfgPath)).toBe(true);
    const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    expect(cfg.outbounds[0].type).toBe('shadowsocks');
    expect(cfg.outbounds[0].server_port).toBe(1);
    expect(cfg.inbounds.find(i => i.type === 'socks').listen_port).toBe(1080);
    expect(cfg.inbounds.find(i => i.type === 'http').listen_port).toBe(1081);
    expect(spawn.callCount).toBe(1);
    await sup.stop();
  });

  it('gives up after 3 restarts within a minute', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sup-'));
    const procs = [];
    const spawn = sinon.fake(() => { const p = fakeSpawn(); procs.push(p); return p; });
    const sup = new SingboxSupervisor({
      binaryPath: '/fake', configDir: dir, spawnFn: spawn,
    });
    await sup.startWith({
      name: 'n', type: 'ss', server: 'h', port: 1,
      cipher: 'aes-256-gcm', password: 'pw', udp: false,
    });
    const gaveUpPromise = sup.gaveUp;
    for (let i = 0; i < 4; i++) {
      procs[i].emit('exit', 1);
      await new Promise(r => setImmediate(r));
    }
    await gaveUpPromise;
    expect(spawn.callCount).toBe(4);
    await sup.stop();
  });

  it('addresses are 127.0.0.1:1080 and :1081', () => {
    const sup = new SingboxSupervisor({
      binaryPath: '/fake', configDir: '/tmp', spawnFn: () => fakeSpawn(),
    });
    expect(sup.socksAddress).toBe('127.0.0.1:1080');
    expect(sup.httpAddress).toBe('127.0.0.1:1081');
  });

  it('kills previous process before spawning the next', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sup-'));
    const procs = [];
    const spawn = sinon.fake(() => { const p = fakeSpawn(); procs.push(p); return p; });
    const sup = new SingboxSupervisor({
      binaryPath: '/fake', configDir: dir, spawnFn: spawn,
    });
    const a = { name: 'a', type: 'ss', server: 'h', port: 1, cipher: 'aes-256-gcm', password: 'pw', udp: false };
    const b = { name: 'b', type: 'ss', server: 'h', port: 2, cipher: 'aes-256-gcm', password: 'pw', udp: false };
    await sup.startWith(a);
    await sup.startWith(b);
    expect(procs[0].kill.callCount).toBeGreaterThanOrEqual(1);
    await sup.stop();
  });

  it('does not burn restart budget when killing previous process during probe walking', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sup-'));
    const procs = [];
    const spawn = sinon.fake(() => { const p = fakeSpawn(); procs.push(p); return p; });
    const sup = new SingboxSupervisor({
      binaryPath: '/fake', configDir: dir, spawnFn: spawn,
    });
    const node = (n) => ({
      name: `n${n}`, type: 'ss', server: 'h', port: n,
      cipher: 'aes-256-gcm', password: 'pw', udp: false,
    });
    // Simulate ProbeSelector walking 3 candidates. Each startWith kills the
    // previous proc; if exit listeners weren't removed, the kill-emit would
    // push extra entries onto _recentStarts and exhaust the budget here.
    // With MAX_RESTARTS_PER_MINUTE=3, the budget allows 1 initial + 3 restarts
    // = 4 total spawns. Walking 3 candidates uses 3 budget slots, leaving room
    // for one crash-restart.
    await sup.startWith(node(1));
    await sup.startWith(node(2));
    await sup.startWith(node(3));
    // Track gaveUp resolution so we can assert it has NOT resolved early.
    let gaveUpResolved = false;
    sup.gaveUp.then(() => { gaveUpResolved = true; });
    await new Promise(r => setImmediate(r));
    // Without the fix, the 2 kills (proc1, proc2) would have each fired
    // exit listeners and either re-spawned or resolved gaveUp early.
    expect(gaveUpResolved).toBe(false);
    // Now emit exit on the *currently active* (3rd) process to fail naturally.
    procs[2].emit('exit', 1);
    await new Promise(r => setImmediate(r));
    // Expected: 3 startWith calls = 3 spawns, plus 1 crash-restart from
    // exiting procs[2] = 4 spawns total. (procs[0] and procs[1] were killed
    // but their exit listeners were detached, so no spurious restarts.)
    expect(spawn.callCount).toBe(4);
    await sup.stop();
  });
});
