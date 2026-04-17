import 'package:flutter_test/flutter_test.dart';
import 'package:edu_potal_app/services/auth_service.dart';
import 'package:edu_potal_app/models/login_dto.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/testing.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  // Configurar cliente HTTP simulado
  final mockHttpClient = MockClient((request) async {
    if (request.url.path == '/api/register') {
      return http.Response('{"success": true}', 200);
    } else if (request.url.path == '/api/login') {
      return http.Response('{"token": "fake_token"}', 200);
    } else if (request.url.path == '/api/update') {
      return http.Response('{"success": true}', 200);
    } else if (request.url.path == '/api/delete') {
      return http.Response('{"success": true}', 200);
    }
    return http.Response('Not Found', 404);
  });

  // Configurar shared_preferences simulado
  SharedPreferences.setMockInitialValues({});

  final authService = AuthService(httpClient: mockHttpClient);

  group('AuthService Tests', () {
    test('Register User', () async {
      final result = await authService.registerUser({
        'username': 'testuser',
        'email': 'testuser@example.com',
        'password': 'password123',
        'roles': ['USER']
      });
      expect(result, true);
    });

    test('Login User', () async {
      final loginDto =
          LoginDto(username: 'testuser@example.com', password: 'password123');
      final result = await authService.login(loginDto);
      expect(result, true);
    });

    test('Update User', () async {
      final result = await authService.updateUser(
          1, {'username': 'updateduser', 'email': 'updateduser@example.com'});
      expect(result, true);
    });

    test('Delete User', () async {
      final result = await authService.deleteUser(1);
      expect(result, true);
    });
  });
}
