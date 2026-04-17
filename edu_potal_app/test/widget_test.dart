// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:edu_potal_app/main.dart';
import 'package:edu_potal_app/services/auth_service.dart';

void main() {
  testWidgets('Counter increments smoke test', (WidgetTester tester) async {
    // Simular el estado de autenticación
    final mockAuthService = AuthService();
    mockAuthService.setMockLoggedIn(true);

    // Build our app and trigger a frame.
    await tester.pumpWidget(
      ChangeNotifierProvider<AuthService>.value(
        value: mockAuthService,
        child: const MyApp(),
      ),
    );

    // Esperar a que termine el estado de carga inicial.
    await tester.pumpAndSettle();

    // Verificar que el texto inicial sea correcto después de la carga.
    expect(find.text('0'), findsOneWidget);
    expect(find.text('1'), findsNothing);

    // Simular un tap en el botón de incremento y verificar el cambio.
    await tester.tap(find.byIcon(Icons.add));
    await tester.pump();

    // Verificar que el contador se haya incrementado.
    expect(find.text('1'), findsOneWidget);
    expect(find.text('0'), findsNothing);
  });
}
