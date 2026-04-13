import 'package:flutter_test/flutter_test.dart';

import 'package:h5_app/main.dart';

void main() {
  testWidgets('App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const H5App());
    expect(find.byType(H5App), findsOneWidget);
  });
}
