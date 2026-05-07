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
});
