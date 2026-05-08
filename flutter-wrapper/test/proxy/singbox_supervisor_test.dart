import 'dart:async';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:h5_app/proxy/proxy_node.dart';
import 'package:h5_app/proxy/singbox_supervisor.dart';

class _FakeProcess {
  final int pid;
  final Completer<int> _exit = Completer<int>();
  _FakeProcess(this.pid);
  Future<int> get exitCode => _exit.future;
  void kill() {}
  void exitWith(int code) => _exit.complete(code);
}

class _FakeProcessWithKillCounter extends _FakeProcess {
  final void Function() onKill;
  _FakeProcessWithKillCounter(super.pid, this.onKill);
  @override
  void kill() => onKill();
}

void main() {
  test('writes config file before spawning', () async {
    final tmp = await Directory.systemTemp.createTemp('singbox_sup');
    addTearDown(() => tmp.delete(recursive: true));

    String? receivedConfigPath;
    int spawned = 0;
    final fakeProcess = _FakeProcess(1234);
    final supervisor = SingboxSupervisor(
      binaryPath: '/fake/sing-box',
      configDir: tmp.path,
      processFactory: (binary, args) {
        spawned++;
        receivedConfigPath = args.contains('-c')
            ? args[args.indexOf('-c') + 1]
            : null;
        return Future.value(fakeProcess);
      },
    );

    const node = ProxyNode(
      name: 'n', type: 'ss', server: 'h', port: 1,
      cipher: 'aes-256-gcm', password: 'pw',
    );
    await supervisor.startWith(node);
    expect(spawned, 1);
    expect(receivedConfigPath, isNotNull);
    final cfg = File(receivedConfigPath!);
    expect(cfg.existsSync(), true);
    final content = await cfg.readAsString();
    expect(content.contains('shadowsocks'), true);
    expect(content.contains('"server_port": 1'), true);

    await supervisor.stop();
  });

  test('restarts up to 3 times per minute then gives up', () async {
    final tmp = await Directory.systemTemp.createTemp('singbox_sup');
    addTearDown(() => tmp.delete(recursive: true));

    final processes = <_FakeProcess>[];
    int spawned = 0;
    final supervisor = SingboxSupervisor(
      binaryPath: '/fake/sing-box',
      configDir: tmp.path,
      processFactory: (binary, args) {
        spawned++;
        final p = _FakeProcess(spawned);
        processes.add(p);
        return Future.value(p);
      },
    );

    const node = ProxyNode(
      name: 'n', type: 'ss', server: 'h', port: 1,
      cipher: 'aes-256-gcm', password: 'pw',
    );
    final givenUp = expectLater(supervisor.gaveUp, completes);
    await supervisor.startWith(node);
    // Trigger 4 crashes; the 4th should resolve gaveUp.
    // Each restart now forks `chmod` (Process.run) on POSIX to lock down the
    // config; that wall-clock cost can exceed 10ms on slow hosts, so give the
    // restart loop a bit more breathing room before crashing the next process.
    for (var i = 0; i < 4; i++) {
      processes[i].exitWith(1);
      await Future<void>.delayed(const Duration(milliseconds: 100));
    }
    await givenUp;
    expect(spawned, 4); // 1 initial + 3 restarts
  });

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
}
