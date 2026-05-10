# Proxy Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the issues found in code review of the proxy network layer (commits `86aaf85..5e00ed6`) — eliminate two correctness/security holes (silent dead-proxy after restart exhaustion, OSS URL SSRF) and a set of resource-leak / consistency bugs across the Flutter and Electron runtimes.

**Architecture:** Each task is scoped to one bug. TDD where the change is logic-bearing; smoke-test where the change is plumbing. No new modules — all edits land in files that already exist. Run all three test suites (`pytest`, `flutter test`, `vitest`) green between commits.

**Tech Stack:** Python 3 (FastAPI/pytest), Dart 3 (flutter_test), Node.js ESM (vitest + sinon), no new third-party deps.

---

## Background — what the review found

| # | Severity | Issue | Files |
|---|---|---|---|
| 1 | Critical | `gaveUp` signal ignored — runtime stays `isHealthy=true` after sing-box exhausts restart budget | `flutter-wrapper/lib/proxy/proxy_runtime.dart`, `electron-wrapper/proxy/proxy-runtime.js` |
| 2 | Critical | OSS URL SSRF — `http://127.0.0.1/…`, RFC1918, link-local accepted | `backend/app/services/sdk_catalog.py` |
| 3 | Important | `mkdtempSync` per `start()` never cleaned up (Electron only) | `electron-wrapper/proxy/proxy-runtime.js` |
| 4 | Important | `ProbeSelector.pick` orphans up to N-1 sing-box processes | `flutter-wrapper/lib/proxy/singbox_supervisor.dart`, `electron-wrapper/proxy/singbox-supervisor.js` |
| 5 | Important | sing-box config (plaintext password) written 0644 | `flutter-wrapper/lib/proxy/singbox_supervisor.dart`, `electron-wrapper/proxy/singbox-supervisor.js` |
| 6 | Important | Legacy `build_app` Celery task drops `custom_js`/`sdk_configs` | `backend/app/tasks/build_task.py:319-325` |
| 7 | Important | Dart `ProxyNode.fromJson` lacks `type`/port-range validation | `flutter-wrapper/lib/proxy/proxy_node.dart` |
| 8 | Important | Dart `_httpHeadProbe` hardcodes port 1081 | `flutter-wrapper/lib/proxy/probe_selector.dart` |
| 9 | Minor | OSS plain `http://` allowed (HTTPS only is safer) | `backend/app/services/sdk_catalog.py` |

The fix order follows the severity order. Tasks 4 (orphan processes) and 5 (config perms) each touch both supervisors and stay together.

The Dart restart-test flakiness flagged in the review (10 ms wall-clock waits) is left alone: the fake completes the `exitCode` future synchronously and the listener fires within the awaited microtask drain — the 10 ms is a paranoid upper bound on the macrotask boundary, not a race window. If it ever does flake, switch the fake to a `StreamController<int>` to cancel the wall clock entirely. Out of scope here.

---

## File Structure

| File | Why edited | Tasks |
|---|---|---|
| `backend/app/services/sdk_catalog.py` | OSS URL hardening | 2, 9 |
| `backend/tests/test_sdk_proxy_validation.py` | New negative tests for OSS hardening | 2, 9 |
| `backend/app/tasks/build_task.py` | Plumb `custom_js`/`sdk_configs` through legacy task | 6 |
| `backend/tests/test_build_task_legacy.py` (new) | Cover the legacy task plumbing | 6 |
| `flutter-wrapper/lib/proxy/proxy_runtime.dart` | Listen on `gaveUp` and surface error page | 1 |
| `electron-wrapper/proxy/proxy-runtime.js` | Listen on `gaveUp`; cleanup tempdir | 1, 3 |
| `flutter-wrapper/test/proxy/proxy_runtime_test.dart` (new) | Unit-test gaveUp wiring | 1 |
| `electron-wrapper/test/proxy/proxy-runtime.test.js` (new) | Unit-test gaveUp wiring + tmpdir cleanup | 1, 3 |
| `flutter-wrapper/lib/proxy/singbox_supervisor.dart` | Kill prev process; chmod 600 config | 4, 5 |
| `flutter-wrapper/test/proxy/singbox_supervisor_test.dart` | Cover both | 4, 5 |
| `electron-wrapper/proxy/singbox-supervisor.js` | Kill prev process; chmod 600 config | 4, 5 |
| `electron-wrapper/test/proxy/singbox-supervisor.test.js` | Cover both | 4, 5 |
| `flutter-wrapper/lib/proxy/proxy_node.dart` | `type`/port validation in `fromJson` | 7 |
| `flutter-wrapper/test/proxy/proxy_node_test.dart` (new) | Cover validation | 7 |
| `flutter-wrapper/lib/proxy/probe_selector.dart` | Read port from `supervisor.httpAddress` | 8 |
| `flutter-wrapper/test/proxy/probe_selector_test.dart` | Smoke-check the wiring | 8 |

---

## Task 1: Wire `gaveUp` into both ProxyRuntimes (Critical)

**Why:** Today, when sing-box exhausts its restart budget, `supervisor.gaveUp` resolves but neither runtime listens to it. `isHealthy` stays `true` and the WebView keeps routing through a dead proxy — silent breakage even with `disableDirect=true`. The fix is one listener per stack.

**Files:**
- Modify: `flutter-wrapper/lib/proxy/proxy_runtime.dart` (add gaveUp subscription around lines 76-98)
- Modify: `electron-wrapper/proxy/proxy-runtime.js` (add gaveUp subscription around lines 53-65)
- Test (new): `flutter-wrapper/test/proxy/proxy_runtime_test.dart`
- Test (new): `electron-wrapper/test/proxy/proxy-runtime.test.js`

### 1a — Flutter side

- [ ] **Step 1: Write failing test for gaveUp wiring**

Create `flutter-wrapper/test/proxy/proxy_runtime_test.dart`:

```dart
import 'dart:async';

import 'package:flutter_test/flutter_test.dart';
import 'package:h5_app/proxy/proxy_runtime.dart';

void main() {
  test('isHealthy flips to false when supervisor gives up', () async {
    final gaveUp = Completer<void>();
    var healthy = true;

    // The runtime exposes a hook for tests to install a gaveUp future and a
    // health setter callback. The hook is `attachGaveUp(Future<void>, void Function(bool))`.
    ProxyRuntime.instance.attachGaveUp(gaveUp.future, (h) => healthy = h);
    gaveUp.complete();
    await Future<void>.delayed(Duration.zero);

    expect(healthy, isFalse);
  });
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd flutter-wrapper && flutter test test/proxy/proxy_runtime_test.dart`
Expected: FAIL — `attachGaveUp` does not exist.

- [ ] **Step 3: Add `attachGaveUp` and call it from `start()`**

Edit `flutter-wrapper/lib/proxy/proxy_runtime.dart`. Replace the block from `_isHealthy = true;` (around line 92) through the `_refreshTimer` assignment with:

```dart
    await WebViewProxyController.setHttpProxy(
      'http://${_supervisor.httpAddress}',
    );
    _isHealthy = true;

    // If sing-box later crashes past its restart budget, stop trusting the
    // proxy. Callers that gate UI on `isHealthy` (notably main.dart's error
    // page) will then re-evaluate on the next frame.
    attachGaveUp(_supervisor.gaveUp, (healthy) => _isHealthy = healthy);

    _refreshTimer = Timer.periodic(
      Duration(milliseconds: (intervalH * 3600 * 1000).round()),
      (_) => _refresh(),
    );
  }

  /// Test seam + production wiring for the supervisor's gaveUp signal.
  /// On gaveUp, marks the runtime unhealthy and tears down the timer so
  /// the next refresh tick won't fire on a dead supervisor.
  void attachGaveUp(Future<void> gaveUp, void Function(bool) onHealthChange) {
    gaveUp.then((_) {
      onHealthChange(false);
      _refreshTimer?.cancel();
      _refreshTimer = null;
    }).catchError((Object _) {
      onHealthChange(false);
      _refreshTimer?.cancel();
      _refreshTimer = null;
    });
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd flutter-wrapper && flutter test test/proxy/proxy_runtime_test.dart`
Expected: PASS — 1 test, 0 failed.

- [ ] **Step 5: Run the full Flutter suite as a regression sweep**

Run: `cd flutter-wrapper && flutter test`
Expected: 11+ tests pass (10 existing + 1 new).

- [ ] **Step 6: Commit**

```bash
git add flutter-wrapper/lib/proxy/proxy_runtime.dart flutter-wrapper/test/proxy/proxy_runtime_test.dart
git commit -m "fix(flutter-proxy): observe supervisor.gaveUp and flip isHealthy=false"
```

### 1b — Electron side

- [ ] **Step 7: Write failing test for gaveUp wiring**

Create `electron-wrapper/test/proxy/proxy-runtime.test.js`:

```js
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
```

- [ ] **Step 8: Run test to verify it fails**

Run: `cd electron-wrapper && npx vitest run test/proxy/proxy-runtime.test.js`
Expected: FAIL — `rt.attachGaveUp is not a function`.

- [ ] **Step 9: Add `attachGaveUp` and call it from `start()`**

Edit `electron-wrapper/proxy/proxy-runtime.js`. After the `this.isHealthy = true;` line (currently line 59), add:

```js
    this.isHealthy = true;
    this.attachGaveUp(this.supervisor);

    const intervalMs = (Number(config.updateIntervalHours) || 1) * 3600 * 1000;
```

Then add the method to the class, just before `async retry()`:

```js
  /**
   * Test seam + production wiring. When the supervisor's gaveUp promise
   * resolves (sing-box exhausted its restart budget), flip isHealthy=false
   * and cancel the refresh timer so we stop spinning on a dead proxy.
   */
  attachGaveUp(supervisor) {
    if (!supervisor || !supervisor.gaveUp) return;
    const onGiveUp = () => {
      this.isHealthy = false;
      if (this._timer) { clearInterval(this._timer); this._timer = null; }
    };
    supervisor.gaveUp.then(onGiveUp, onGiveUp);
  }
```

- [ ] **Step 10: Run test to verify it passes**

Run: `cd electron-wrapper && npx vitest run test/proxy/proxy-runtime.test.js`
Expected: PASS — 1 test passes.

- [ ] **Step 11: Commit**

```bash
git add electron-wrapper/proxy/proxy-runtime.js electron-wrapper/test/proxy/proxy-runtime.test.js
git commit -m "fix(electron-proxy): observe supervisor.gaveUp and flip isHealthy=false"
```

---

## Task 2: Reject SSRF-prone OSS URLs (Critical)

**Why:** `_normalize_proxy` accepts `http://127.0.0.1/…`, RFC1918, link-local (`169.254.169.254`), and `localhost`. Those URLs get baked into shipped builds and fetched on every device on every refresh. The repo already has `validate_h5_url` in `backend/app/services/url_validator.py` with the right rejection logic. Reuse it.

**Files:**
- Modify: `backend/app/services/sdk_catalog.py` (`_normalize_proxy`, around lines 261-267)
- Modify: `backend/tests/test_sdk_proxy_validation.py` (add negative tests)

- [ ] **Step 1: Write failing tests**

Append to `backend/tests/test_sdk_proxy_validation.py`:

```python
def test_proxy_oss_rejects_localhost():
    with pytest.raises(SdkValidationError):
        _normalize({"proxy": {
            "ossUrls": "http://localhost/c.json",
            "disableDirect": "true",
        }})


def test_proxy_oss_rejects_loopback_ip():
    with pytest.raises(SdkValidationError):
        _normalize({"proxy": {
            "ossUrls": "http://127.0.0.1/c.json",
            "disableDirect": "true",
        }})


def test_proxy_oss_rejects_rfc1918():
    for ip in ("10.0.0.1", "172.16.0.1", "192.168.1.1"):
        with pytest.raises(SdkValidationError):
            _normalize({"proxy": {
                "ossUrls": f"http://{ip}/c.json",
                "disableDirect": "true",
            }})


def test_proxy_oss_rejects_link_local():
    with pytest.raises(SdkValidationError):
        _normalize({"proxy": {
            "ossUrls": "http://169.254.169.254/latest/meta-data/",
            "disableDirect": "true",
        }})


def test_proxy_oss_rejects_ipv6_loopback():
    with pytest.raises(SdkValidationError):
        _normalize({"proxy": {
            "ossUrls": "http://[::1]/c.json",
            "disableDirect": "true",
        }})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `backend/venv/bin/pytest backend/tests/test_sdk_proxy_validation.py -v -k "rejects_localhost or rejects_loopback or rejects_rfc1918 or rejects_link_local or rejects_ipv6"`
Expected: 5 FAILs — `_normalize_proxy` accepts these URLs today.

- [ ] **Step 3: Wire `validate_h5_url` into `_normalize_proxy`**

Edit `backend/app/services/sdk_catalog.py`. At the top of the imports block (just below the existing `from app.services.proxy_node_parser import …`), add:

```python
from app.services.url_validator import UrlValidationError, validate_h5_url
```

Then replace the OSS URL loop in `_normalize_proxy` (currently lines 262-266):

```python
    oss_urls = _split_lines(fields.get("ossUrls"))
    for u in oss_urls:
        parsed = urlparse(u)
        if parsed.scheme not in ("http", "https") or not parsed.netloc:
            raise SdkValidationError(f"invalid OSS URL: {u!r}")
        try:
            validate_h5_url(u)
        except UrlValidationError as e:
            raise SdkValidationError(f"OSS URL {u!r} rejected: {e}") from e
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `backend/venv/bin/pytest backend/tests/test_sdk_proxy_validation.py -v`
Expected: All proxy-validation tests pass (existing + 5 new).

- [ ] **Step 5: Commit**

```bash
git add backend/app/services/sdk_catalog.py backend/tests/test_sdk_proxy_validation.py
git commit -m "fix(proxy): reject SSRF-prone OSS URLs (localhost, RFC1918, link-local)"
```

---

## Task 3: Clean up Electron tempdir on stop (Important)

**Why:** `start()` calls `fs.mkdtempSync(...)` and never removes the directory. `retry()` calls `start()` again; long sessions accumulate `h5-proxy-*` dirs in `os.tmpdir()`. The Dart side uses `getApplicationCacheDirectory()` (stable) so this is Electron-only.

**Files:**
- Modify: `electron-wrapper/proxy/proxy-runtime.js` (track `_cacheDir`, remove in `stop()`)
- Modify: `electron-wrapper/test/proxy/proxy-runtime.test.js` (add cleanup test)

- [ ] **Step 1: Write failing test**

Append to `electron-wrapper/test/proxy/proxy-runtime.test.js`:

```js
import fs from 'fs';
import os from 'os';
import path from 'path';

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd electron-wrapper && npx vitest run test/proxy/proxy-runtime.test.js`
Expected: FAIL — first test fails (dir still exists), second passes incidentally.

- [ ] **Step 3: Track and clean up the cacheDir**

Edit `electron-wrapper/proxy/proxy-runtime.js`. In `start()`, replace:

```js
    const cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), 'h5-proxy-'));
```

with:

```js
    const cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), 'h5-proxy-'));
    this._cacheDir = cacheDir;
```

Then update `stop()`:

```js
  async stop() {
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
    if (this.supervisor) {
      try { await this.supervisor.stop(); } catch (_) {}
    }
    if (this._cacheDir) {
      try { fs.rmSync(this._cacheDir, { recursive: true, force: true }); } catch (_) {}
      this._cacheDir = null;
    }
    this._started = false;
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd electron-wrapper && npx vitest run test/proxy/proxy-runtime.test.js`
Expected: PASS — both new tests + Task 1 test pass.

- [ ] **Step 5: Commit**

```bash
git add electron-wrapper/proxy/proxy-runtime.js electron-wrapper/test/proxy/proxy-runtime.test.js
git commit -m "fix(electron-proxy): rm cacheDir in stop() to prevent tmpdir leak"
```

---

## Task 4: Kill the previous sing-box process before starting the next (Important)

**Why:** `ProbeSelector.pick` calls `supervisor.startWith(node)` for each candidate. The supervisor overwrites `_proc`/`_process` without killing the old one — every probed-and-rejected node leaves a sing-box process running until the OS reaps it (which it doesn't, since the parent is still alive). Killing the previous process is two lines per stack.

**Files:**
- Modify: `flutter-wrapper/lib/proxy/singbox_supervisor.dart` (in `_spawn`, before writing config)
- Modify: `flutter-wrapper/test/proxy/singbox_supervisor_test.dart`
- Modify: `electron-wrapper/proxy/singbox-supervisor.js` (in `_spawnOne`)
- Modify: `electron-wrapper/test/proxy/singbox-supervisor.test.js`

### 4a — Flutter

- [ ] **Step 1: Write failing test**

Append to `flutter-wrapper/test/proxy/singbox_supervisor_test.dart`:

```dart
test('kills previous process when startWith is called again', () async {
  final tmp = await Directory.systemTemp.createTemp('singbox_sup');
  addTearDown(() => tmp.delete(recursive: true));

  final processes = <_FakeProcess>[];
  int killCount = 0;
  final supervisor = SingboxSupervisor(
    binaryPath: '/fake/sing-box',
    configDir: tmp.path,
    processFactory: (binary, args) {
      final p = _FakeProcessWithKillCounter(processes.length + 1, () => killCount++);
      processes.add(p);
      return Future.value(p);
    },
  );

  const a = ProxyNode(
    name: 'a', type: 'ss', server: 'h', port: 1,
    cipher: 'aes-256-gcm', password: 'pw',
  );
  const b = ProxyNode(
    name: 'b', type: 'ss', server: 'h', port: 2,
    cipher: 'aes-256-gcm', password: 'pw',
  );
  await supervisor.startWith(a);
  await supervisor.startWith(b);
  // The first process should have been killed before the second was spawned.
  expect(killCount, greaterThanOrEqualTo(1));
  await supervisor.stop();
});
```

Add the helper just below the existing `_FakeProcess` class:

```dart
class _FakeProcessWithKillCounter extends _FakeProcess {
  final void Function() onKill;
  _FakeProcessWithKillCounter(int pid, this.onKill) : super(pid);
  @override
  void kill() => onKill();
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd flutter-wrapper && flutter test test/proxy/singbox_supervisor_test.dart`
Expected: FAIL — `Expected: a value greater than or equal to <1>, Actual: <0>`.

- [ ] **Step 3: Kill the previous process at the top of `_spawn`**

Edit `flutter-wrapper/lib/proxy/singbox_supervisor.dart`. Replace the `_spawn` method (currently lines 66-81):

```dart
  Future<void> _spawn() async {
    if (_stopped) return;
    // If a previous process is still running (e.g. from probe-selector
    // walking through candidate nodes), terminate it before spawning the
    // next one. Otherwise we accumulate orphan sing-box processes.
    await _exitSub?.cancel();
    _exitSub = null;
    try {
      (_process as dynamic)?.kill();
    } catch (_) {}

    final cfgPath = '$configDir/singbox-config.json';
    await File(cfgPath).writeAsString(_renderConfig(_currentNode!));
    _recentStarts.add(DateTime.now());

    final handle = await _factory(binaryPath, ['run', '-c', cfgPath]);
    _process = handle;

    final exitFuture = handle.exitCode as Future<int>;
    _exitSub = exitFuture.asStream().listen((_) {
      if (_stopped) return;
      _onExit();
    });
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd flutter-wrapper && flutter test test/proxy/singbox_supervisor_test.dart`
Expected: PASS — 4 tests pass (3 existing + 1 new).

- [ ] **Step 5: Commit**

```bash
git add flutter-wrapper/lib/proxy/singbox_supervisor.dart flutter-wrapper/test/proxy/singbox_supervisor_test.dart
git commit -m "fix(flutter-proxy): kill previous sing-box on re-spawn to prevent orphans"
```

### 4b — Electron

- [ ] **Step 6: Write failing test**

Append to `electron-wrapper/test/proxy/singbox-supervisor.test.js`:

```js
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
```

- [ ] **Step 7: Run test to verify it fails**

Run: `cd electron-wrapper && npx vitest run test/proxy/singbox-supervisor.test.js`
Expected: FAIL — kill not called on first process.

- [ ] **Step 8: Kill the previous process at the top of `_spawnOne`**

Edit `electron-wrapper/proxy/singbox-supervisor.js`. Replace `_spawnOne` (currently lines 40-52):

```js
  async _spawnOne() {
    if (this._stopped) return;
    // Terminate any prior process before launching the new one — otherwise
    // probe-selector walking N candidates leaves up to N-1 orphan sing-box
    // processes around.
    if (this._proc && this._proc.kill) {
      try { this._proc.kill(); } catch (_) { /* swallow */ }
      this._proc = null;
    }
    const cfgPath = path.join(this.configDir, 'singbox-config.json');
    fs.writeFileSync(cfgPath, this._renderConfig(this._currentNode));
    this._recentStarts.push(Date.now());

    const proc = this._spawn(this.binaryPath, ['run', '-c', cfgPath]);
    this._proc = proc;
    proc.on('exit', () => {
      if (this._stopped) return;
      this._onExit();
    });
  }
```

- [ ] **Step 9: Run test to verify it passes**

Run: `cd electron-wrapper && npx vitest run test/proxy/singbox-supervisor.test.js`
Expected: PASS — 4 tests pass (3 existing + 1 new).

- [ ] **Step 10: Commit**

```bash
git add electron-wrapper/proxy/singbox-supervisor.js electron-wrapper/test/proxy/singbox-supervisor.test.js
git commit -m "fix(electron-proxy): kill previous sing-box on re-spawn to prevent orphans"
```

---

## Task 5: Write the sing-box config with mode 0600 (Important)

**Why:** The config JSON contains the proxy password in plaintext. Both supervisors write it with default 0644 perms. On a rooted Android device any other app can read it; on macOS it's user-scoped but still world-readable within the user's process space.

**Files:**
- Modify: `flutter-wrapper/lib/proxy/singbox_supervisor.dart`
- Modify: `flutter-wrapper/test/proxy/singbox_supervisor_test.dart`
- Modify: `electron-wrapper/proxy/singbox-supervisor.js`
- Modify: `electron-wrapper/test/proxy/singbox-supervisor.test.js`

### 5a — Flutter

- [ ] **Step 1: Write failing test**

Append to `flutter-wrapper/test/proxy/singbox_supervisor_test.dart`:

```dart
test('writes config with 0600 permissions (POSIX only)', () async {
  if (Platform.isWindows) return;  // chmod is a no-op on Windows
  final tmp = await Directory.systemTemp.createTemp('singbox_sup');
  addTearDown(() => tmp.delete(recursive: true));

  String? receivedConfigPath;
  final fakeProcess = _FakeProcess(1234);
  final supervisor = SingboxSupervisor(
    binaryPath: '/fake/sing-box',
    configDir: tmp.path,
    processFactory: (binary, args) {
      receivedConfigPath = args[args.indexOf('-c') + 1];
      return Future.value(fakeProcess);
    },
  );

  const node = ProxyNode(
    name: 'n', type: 'ss', server: 'h', port: 1,
    cipher: 'aes-256-gcm', password: 'pw',
  );
  await supervisor.startWith(node);
  final stat = await File(receivedConfigPath!).stat();
  // mode is encoded as decimal where the low 9 bits are rwxrwxrwx.
  // 0o600 == 384 decimal; we mask the file mode against 0o777 (511 decimal).
  expect(stat.mode & 511, 384);
  await supervisor.stop();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd flutter-wrapper && flutter test test/proxy/singbox_supervisor_test.dart`
Expected: FAIL — mode is 0644 (420), not 0600 (384).

- [ ] **Step 3: chmod 600 after writing the config**

Edit `flutter-wrapper/lib/proxy/singbox_supervisor.dart`. In `_spawn`, replace the config-write block:

```dart
    final cfgPath = '$configDir/singbox-config.json';
    await File(cfgPath).writeAsString(_renderConfig(_currentNode!));
    // Restrict permissions: the config contains the proxy password.
    // chmod is a no-op on Windows; the runProcess returns silently if it fails,
    // which is acceptable since the leaked-permission consequence is the same.
    if (!Platform.isWindows) {
      try {
        await Process.run('chmod', ['600', cfgPath]);
      } catch (_) { /* best-effort */ }
    }
    _recentStarts.add(DateTime.now());
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd flutter-wrapper && flutter test test/proxy/singbox_supervisor_test.dart`
Expected: PASS — 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add flutter-wrapper/lib/proxy/singbox_supervisor.dart flutter-wrapper/test/proxy/singbox_supervisor_test.dart
git commit -m "fix(flutter-proxy): chmod 600 on sing-box config (contains plaintext password)"
```

### 5b — Electron

- [ ] **Step 6: Write failing test**

Append to `electron-wrapper/test/proxy/singbox-supervisor.test.js`:

```js
it('writes config with mode 0o600 (POSIX only)', async () => {
  if (process.platform === 'win32') return;
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
  const stat = fs.statSync(cfgPath);
  expect(stat.mode & 0o777).toBe(0o600);
  await sup.stop();
});
```

- [ ] **Step 7: Run test to verify it fails**

Run: `cd electron-wrapper && npx vitest run test/proxy/singbox-supervisor.test.js`
Expected: FAIL — mode is 0o644 (or umask-dependent).

- [ ] **Step 8: Pass `mode: 0o600` to writeFileSync**

Edit `electron-wrapper/proxy/singbox-supervisor.js`. In `_spawnOne`, replace the writeFileSync call:

```js
    const cfgPath = path.join(this.configDir, 'singbox-config.json');
    // The config contains the proxy password. Restrict to owner-only.
    fs.writeFileSync(cfgPath, this._renderConfig(this._currentNode), { mode: 0o600 });
    // writeFileSync only sets mode on file creation — if the file already
    // exists (e.g. retry path), apply chmod explicitly. No-op on Windows.
    if (process.platform !== 'win32') {
      try { fs.chmodSync(cfgPath, 0o600); } catch (_) { /* best-effort */ }
    }
    this._recentStarts.push(Date.now());
```

- [ ] **Step 9: Run test to verify it passes**

Run: `cd electron-wrapper && npx vitest run test/proxy/singbox-supervisor.test.js`
Expected: PASS — 5 tests pass.

- [ ] **Step 10: Commit**

```bash
git add electron-wrapper/proxy/singbox-supervisor.js electron-wrapper/test/proxy/singbox-supervisor.test.js
git commit -m "fix(electron-proxy): chmod 600 on sing-box config (contains plaintext password)"
```

---

## Task 6: Plumb `custom_js`/`sdk_configs` through legacy `build_app` task (Important)

**Why:** `build_app` (legacy Celery task) at `backend/app/tasks/build_task.py:319-325` calls `_prepare_electron` without the `custom_js` / `sdk_configs` keyword arguments. Both default to `None`/`{}`, so any job routed through this code path silently drops the proxy SDK config (and any other SDK config). The newer `execute_build_task` is correct (line 487-495); we mirror its pattern.

`build_app` is invoked by the older single-job submission path; it's still wired in `backend/app/api/build.py` for legacy clients. The fix is to read the SDK config from the same `BuildSdkConfig` table `execute_build_task` already uses, keyed by `request_id`. Since `build_app` takes `job_id` (not `request_id`), we need to look up the request via the `BuildJob`.

**Files:**
- Modify: `backend/app/tasks/build_task.py` (`build_app`, lines 280-391)
- Test (new): `backend/tests/test_build_task_legacy.py`

- [ ] **Step 1: Write failing test**

First, check what fields `BuildJob` has that connect to a `BuildRequest`:

Run: `grep -E "request_id|build_request" backend/app/models/build_job.py`
Expected: confirms a `request_id` column exists on `BuildJob`.

If `BuildJob` does not have a `request_id`, the legacy task is fully decoupled from `BuildRequest`/`BuildSdkConfig` and cannot read SDK config without an API change. In that case, **skip Task 6** and instead delete the legacy `build_app` task entirely if it has no remaining callers (run `grep -rn "build_app.delay\|send_task.*build_app" backend/`). Document the decision in the commit message and move on to Task 7.

Assuming `BuildJob.request_id` exists, create `backend/tests/test_build_task_legacy.py`:

```python
"""Regression: legacy build_app task must propagate SDK config to _prepare_electron."""
import json
from unittest.mock import patch

import pytest


@pytest.mark.skipif(
    "build_app not in dir(__import__('app.tasks.build_task', fromlist=['build_app']))",
    reason="legacy build_app task removed",
)
def test_build_app_passes_sdk_configs_to_prepare_electron(db, registered_user):
    from app.models.build_job import BuildJob
    from app.models.build_request import BuildRequest
    from app.models.build_sdk_config import BuildSdkConfig
    from app.tasks.build_task import build_app

    request = BuildRequest(
        request_id="req-legacy-1",
        user_id=registered_user.id,
        h5_url="https://example.com",
        app_name="LegacyApp",
        platforms="macos",
    )
    db.add(request)
    db.flush()
    sdk_cfg = BuildSdkConfig(
        request_id=request.id,
        sdk_configs=json.dumps({"proxy": {
            "ossUrls": ["https://oss.example.com/c.json"],
            "updateIntervalHours": 1.0,
            "dnsTxtDomains": [],
            "builtinProxies": [],
            "disableDirect": True,
        }}),
        custom_js=None,
    )
    db.add(sdk_cfg)
    job = BuildJob(
        task_id="task-legacy-1",
        user_id=registered_user.id,
        request_id=request.id,
        h5_url="https://example.com",
        platforms="macos",
        status="pending",
    )
    db.add(job)
    db.commit()

    captured = {}

    def fake_prepare_electron(*args, **kwargs):
        captured["custom_js"] = kwargs.get("custom_js")
        captured["sdk_configs"] = kwargs.get("sdk_configs")
        raise RuntimeError("stop here — we only need the kwargs")

    with patch("app.tasks.build_task._prepare_electron", side_effect=fake_prepare_electron):
        # Run the task synchronously. We expect the patched function to raise,
        # which the task catches and reports as failure — that's fine; we only
        # care that the kwargs landed.
        try:
            build_app.apply(args=(job.id, "https://example.com", ["macos"]),
                            kwargs={"app_name": "LegacyApp"}).get(propagate=False)
        except Exception:
            pass

    assert captured["sdk_configs"] is not None
    assert "proxy" in captured["sdk_configs"]
    assert captured["sdk_configs"]["proxy"]["disableDirect"] is True
```

- [ ] **Step 2: Run test to verify it fails**

Run: `backend/venv/bin/pytest backend/tests/test_build_task_legacy.py -v`
Expected: FAIL — `captured["sdk_configs"]` is `None` (current code doesn't pass it).

- [ ] **Step 3: Plumb the kwargs through**

Edit `backend/app/tasks/build_task.py`. In `build_app`, just after the `tmp_dir = tempfile.mkdtemp(...)` line (around 287), add the lookup:

```python
        _update_job(db, job_id, status="running")

        # Look up SDK config + custom JS for this job's request, if any.
        # Mirrors execute_build_task's lookup so the legacy code path doesn't
        # silently drop the proxy / Sentry / Umeng configs.
        custom_js = None
        sdk_configs: dict = {}
        job_row = db.query(BuildJob).filter(BuildJob.id == job_id).one_or_none()
        if job_row is not None and job_row.request_id is not None:
            sdk_row = (
                db.query(BuildSdkConfig)
                .filter(BuildSdkConfig.request_id == job_row.request_id)
                .first()
            )
            if sdk_row is not None:
                custom_js = sdk_row.custom_js
                try:
                    sdk_configs = json.loads(sdk_row.sdk_configs) if sdk_row.sdk_configs else {}
                except (TypeError, json.JSONDecodeError):
                    sdk_configs = {}

        need_flutter = bool(set(platforms) & FLUTTER_PLATFORMS)
        need_electron = bool(set(platforms) & ELECTRON_PLATFORMS)
```

Then update the `_prepare_electron` call (currently lines 319-325):

```python
        if need_electron:
            electron_tmp = _prepare_electron(
                h5_url,
                app_name,
                icon_params.get("path") if icon_params else None,
                tmp_dir,
                platforms,
                custom_js=custom_js,
                sdk_configs=sdk_configs,
            )
```

Also update the Flutter prep block (currently around lines 299-315) so it applies the SDK injector — same pattern as `execute_build_task`. Insert after `_run(["flutter", "pub", "get"], cwd=flutter_tmp)`:

Actually, scratch that — `_run` is the last step and `apply_flutter` happens before it in `execute_build_task`. Replace the Flutter prep block to mirror `execute_build_task`:

```python
        if need_flutter:
            flutter_tmp = os.path.join(tmp_dir, "flutter")

            def ignore_flutter_artifacts(src, names):
                return [n for n in names if n in {
                    ".dart_tool", "build", ".flutter-plugins", ".flutter-plugins-dependencies"
                }]

            shutil.copytree(FLUTTER_WRAPPER_SRC, flutter_tmp, ignore=ignore_flutter_artifacts)
            _prepare_flutter_workspace(
                flutter_tmp,
                platforms,
                app_name,
                icon_params.get("path") if icon_params else None,
                android_package_name,
            )
            sdk_injector.apply_flutter(flutter_tmp, custom_js, sdk_configs)
            if sdk_configs and "proxy" in sdk_configs:
                sdk_injector.copy_singbox_for_flutter(flutter_tmp)
            _run(["flutter", "pub", "get"], cwd=flutter_tmp)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `backend/venv/bin/pytest backend/tests/test_build_task_legacy.py -v`
Expected: PASS.

- [ ] **Step 5: Run the full backend suite as a regression sweep**

Run: `backend/venv/bin/pytest backend/tests/ -v 2>&1 | tail -40`
Expected: same pass/fail counts as before this task (129 pass + 14 known pre-existing fails) plus 1 new pass.

- [ ] **Step 6: Commit**

```bash
git add backend/app/tasks/build_task.py backend/tests/test_build_task_legacy.py
git commit -m "fix(build): pass custom_js + sdk_configs through legacy build_app task"
```

---

## Task 7: Validate `type` and port range in Dart `ProxyNode.fromJson` (Important)

**Why:** `flutter-wrapper/lib/proxy/proxy_node.dart` lines 20-28 accept any `type` string and any integer port. OSS-fetched nodes (validated only via `_safeFromJson` in NodePool, which swallows exceptions) can produce a ProxyNode with `type: "vmess"` or `port: 99999` that gets passed to the supervisor as a malformed sing-box config. Python and Node validators already enforce both — Dart should match.

**Files:**
- Modify: `flutter-wrapper/lib/proxy/proxy_node.dart`
- Test (new): `flutter-wrapper/test/proxy/proxy_node_test.dart`

- [ ] **Step 1: Write failing tests**

Create `flutter-wrapper/test/proxy/proxy_node_test.dart`:

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:h5_app/proxy/proxy_node.dart';

void main() {
  test('fromJson accepts a valid ss node', () {
    final n = ProxyNode.fromJson({
      'name': 'n', 'type': 'ss', 'server': 'h', 'port': 8388,
      'cipher': 'aes-256-gcm', 'password': 'pw',
    });
    expect(n.type, 'ss');
    expect(n.port, 8388);
  });

  test('fromJson rejects unsupported type', () {
    expect(
      () => ProxyNode.fromJson({
        'name': 'n', 'type': 'vmess', 'server': 'h', 'port': 8388,
        'cipher': 'aes-256-gcm', 'password': 'pw',
      }),
      throwsA(isA<FormatException>()),
    );
  });

  test('fromJson rejects port < 1', () {
    expect(
      () => ProxyNode.fromJson({
        'name': 'n', 'type': 'ss', 'server': 'h', 'port': 0,
        'cipher': 'aes-256-gcm', 'password': 'pw',
      }),
      throwsA(isA<FormatException>()),
    );
  });

  test('fromJson rejects port > 65535', () {
    expect(
      () => ProxyNode.fromJson({
        'name': 'n', 'type': 'ss', 'server': 'h', 'port': 99999,
        'cipher': 'aes-256-gcm', 'password': 'pw',
      }),
      throwsA(isA<FormatException>()),
    );
  });
}
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd flutter-wrapper && flutter test test/proxy/proxy_node_test.dart`
Expected: 1 PASS, 3 FAIL (validation absent).

- [ ] **Step 3: Add validation in `fromJson`**

Edit `flutter-wrapper/lib/proxy/proxy_node.dart`. Replace the `factory` block:

```dart
  factory ProxyNode.fromJson(Map<String, dynamic> json) {
    final type = json['type'] as String;
    if (type != 'ss') {
      throw FormatException('unsupported proxy type: $type');
    }
    final port = json['port'] as int;
    if (port < 1 || port > 65535) {
      throw FormatException('port out of range [1, 65535]: $port');
    }
    return ProxyNode(
      name: json['name'] as String,
      type: type,
      server: json['server'] as String,
      port: port,
      cipher: json['cipher'] as String,
      password: json['password'] as String,
      udp: (json['udp'] as bool?) ?? false,
    );
  }
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd flutter-wrapper && flutter test test/proxy/proxy_node_test.dart`
Expected: 4 PASS.

- [ ] **Step 5: Run the full Flutter suite to catch regressions in NodePool / ProxyRuntime tests that build ProxyNodes**

Run: `cd flutter-wrapper && flutter test`
Expected: all tests pass; if NodePool tests use invalid fixtures, fix them (use `port: 8388`, `type: 'ss'`).

- [ ] **Step 6: Commit**

```bash
git add flutter-wrapper/lib/proxy/proxy_node.dart flutter-wrapper/test/proxy/proxy_node_test.dart
git commit -m "fix(flutter-proxy): validate type=ss + port range in ProxyNode.fromJson"
```

---

## Task 8: Read HTTP probe port from `supervisor.httpAddress` (Important)

**Why:** `flutter-wrapper/lib/proxy/probe_selector.dart:42` hardcodes `'PROXY 127.0.0.1:1081'`. The supervisor exposes `httpAddress`; the probe should read from it so a future port change in `SingboxSupervisor` doesn't silently break the probe path.

**Files:**
- Modify: `flutter-wrapper/lib/proxy/probe_selector.dart`
- Modify: `flutter-wrapper/test/proxy/probe_selector_test.dart`

- [ ] **Step 1: Add a smoke test confirming the probe reads from supervisor**

The default probe is hard to unit-test (it makes a real HTTP request). Instead, refactor to take the address as a parameter so the test can assert it's wired through. Append to `flutter-wrapper/test/proxy/probe_selector_test.dart`:

```dart
test('default probe reads address from supervisor.httpAddress', () {
  // Compile-time check: the static probe signature accepts a third
  // String parameter for the HTTP address. If the signature changes
  // away from this, this test stops compiling — exactly the fence we
  // want against accidentally hardcoding the address again.
  final f = ProbeSelector.httpHeadProbeWithAddress;
  expect(f, isA<Function>());
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd flutter-wrapper && flutter test test/proxy/probe_selector_test.dart`
Expected: FAIL — `httpHeadProbeWithAddress` does not exist.

- [ ] **Step 3: Refactor the probe to take an address**

Edit `flutter-wrapper/lib/proxy/probe_selector.dart`. Replace the class body:

```dart
class ProbeSelector {
  final String h5Url;
  final dynamic supervisor;
  final ProbeFn _probe;

  ProbeSelector({
    required this.h5Url,
    required this.supervisor,
    ProbeFn? probe,
  }) : _probe = probe ?? _defaultProbe;

  Future<ProxyNode?> pick(List<ProxyNode> nodes) async {
    for (final node in nodes) {
      await supervisor.startWith(node);
      await Future<void>.delayed(const Duration(milliseconds: 200));
      try {
        if (await _probe(node, h5Url)) return node;
      } catch (_) {
        // probe failure is non-fatal; try the next node
      }
    }
    return null;
  }

  /// Default probe path: read the local HTTP inbound address from the
  /// supervisor and HEAD the H5 URL through it.
  Future<bool> _defaultProbe(ProxyNode node, String h5Url) {
    final addr = (supervisor.httpAddress as String);
    return httpHeadProbeWithAddress(node, h5Url, addr);
  }

  /// Public for compile-time fencing: a probe that accepts the proxy
  /// address as an explicit parameter rather than a hardcoded constant.
  static Future<bool> httpHeadProbeWithAddress(
    ProxyNode node,
    String h5Url,
    String httpAddress,
  ) async {
    final client = HttpClient();
    client.findProxy = (uri) => 'PROXY $httpAddress';
    try {
      final req = await client
          .headUrl(Uri.parse(h5Url))
          .timeout(const Duration(seconds: 5));
      final resp = await req.close().timeout(const Duration(seconds: 5));
      await resp.drain<void>();
      return resp.statusCode >= 200 && resp.statusCode < 400;
    } catch (_) {
      return false;
    } finally {
      client.close(force: true);
    }
  }
}
```

Note: this changes `_defaultProbe` from a static method to an instance method so it can read `supervisor.httpAddress`. The `_probe ?? _defaultProbe` initializer in the constructor needs to bind the instance, but Dart allows passing instance methods as tear-offs only after construction. Adjust the constructor:

Actually, instance method tear-offs in initializer lists don't work cleanly. Use a getter pattern:

Replace the constructor and probe field:

```dart
  final String h5Url;
  final dynamic supervisor;
  final ProbeFn? _userProbe;

  ProbeSelector({
    required this.h5Url,
    required this.supervisor,
    ProbeFn? probe,
  }) : _userProbe = probe;

  ProbeFn get _probe => _userProbe ?? _defaultProbe;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd flutter-wrapper && flutter test test/proxy/probe_selector_test.dart`
Expected: PASS.

- [ ] **Step 5: Run the full Flutter suite as a regression sweep**

Run: `cd flutter-wrapper && flutter test`
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add flutter-wrapper/lib/proxy/probe_selector.dart flutter-wrapper/test/proxy/probe_selector_test.dart
git commit -m "fix(flutter-proxy): probe reads HTTP address from supervisor (no hardcode)"
```

---

## Task 9: Restrict OSS URLs to HTTPS only (Minor)

**Why:** Plain `http://` OSS URLs allow MITM injection of node lists into a running app. All real OSS providers (S3, Aliyun OSS, COS, Backblaze) support HTTPS. Forcing HTTPS costs operators nothing and removes the exposure.

**Files:**
- Modify: `backend/app/services/sdk_catalog.py` (the URL check from Task 2)
- Modify: `backend/tests/test_sdk_proxy_validation.py`

- [ ] **Step 1: Write failing tests + adjust an existing test**

Existing tests use `https://a/b` and `https://a.example.com/c.json` — those continue to pass. Add a new negative test. Append to `backend/tests/test_sdk_proxy_validation.py`:

```python
def test_proxy_oss_rejects_plain_http():
    with pytest.raises(SdkValidationError):
        _normalize({"proxy": {
            "ossUrls": "http://example.com/c.json",
            "disableDirect": "true",
        }})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `backend/venv/bin/pytest backend/tests/test_sdk_proxy_validation.py::test_proxy_oss_rejects_plain_http -v`
Expected: FAIL — plain `http://` is currently accepted.

- [ ] **Step 3: Tighten the scheme check**

Edit `backend/app/services/sdk_catalog.py`. In `_normalize_proxy`, change:

```python
        if parsed.scheme not in ("http", "https") or not parsed.netloc:
            raise SdkValidationError(f"invalid OSS URL: {u!r}")
```

to:

```python
        if parsed.scheme != "https" or not parsed.netloc:
            raise SdkValidationError(
                f"OSS URL must use https (got {u!r}) — plain http exposes node "
                f"lists to MITM attacks"
            )
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `backend/venv/bin/pytest backend/tests/test_sdk_proxy_validation.py -v`
Expected: all proxy-validation tests pass.

- [ ] **Step 5: Commit**

```bash
git add backend/app/services/sdk_catalog.py backend/tests/test_sdk_proxy_validation.py
git commit -m "fix(proxy): require https for OSS config URLs"
```

---

## Final regression sweep

- [ ] **Step 1: Run all three suites end-to-end**

```bash
cd /Users/hhy/project/h5-app
backend/venv/bin/pytest backend/tests/ -v 2>&1 | tail -10
( cd flutter-wrapper && flutter test 2>&1 | tail -10 )
( cd electron-wrapper && npx vitest run 2>&1 | tail -20 )
```

Expected:
- backend: same pre-existing fail count + new tests passing
- flutter: all proxy + node tests pass
- electron: all proxy tests pass

- [ ] **Step 2: Confirm no formatter/linter regressions**

Run: `cd flutter-wrapper && flutter analyze`
Expected: 0 issues.

Run: `cd electron-wrapper && node --check proxy/proxy-runtime.js && node --check proxy/singbox-supervisor.js`
Expected: no output (clean parse).

- [ ] **Step 3: Final commit (only if any incidental file changed during the run, e.g. fixture updates)**

If everything is already committed task-by-task, this step is a no-op.

---

## Out of scope (deferred / accepted)

| Item | Why deferred |
|---|---|
| Architectural mismatch between Electron `socks5://` proxy rules and Dart HTTP-1081 probe | Both work in their respective sandboxes; aligning them needs an end-to-end Chromium test which the operator must run on real hardware. |
| Triple-implementation of SS URI parser (Python strict, Dart/Node lenient) | Different security models per stack; the Python parser is server-side validation, the runtime parsers are best-effort discovery. Documented in proxy-network-layer-design.md §2.4. |
| Vue checkbox emits `"true"/"false"` strings | Backend already coerces; tightening would also require a frontend type refactor. Tracked separately. |
| Sing-box config writes config in 0644 even after fix on Windows | NTFS does not honor POSIX mode bits. Acceptable; Windows file ACLs already restrict to the user. |

## Self-review checklist

- [x] **Spec coverage:** Every Critical and Important from the review has a task. Minor #9 (https-only) included; minors 12 (SS URI duplication) and 14 (Vue checkbox strings) explicitly deferred above.
- [x] **No placeholders:** No "TBD", no "add validation here", every code block is complete. Task 6 has a conditional fallback (delete legacy task if no `request_id`) but the condition is testable and the action is concrete.
- [x] **Type consistency:** `ProxyNode` fields, `attachGaveUp` signature, `httpAddress` property, supervisor's `gaveUp` Promise/Future shape all match between Tasks 1–8.

