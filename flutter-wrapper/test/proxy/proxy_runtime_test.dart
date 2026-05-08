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
