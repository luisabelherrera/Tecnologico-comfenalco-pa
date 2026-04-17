import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/api_constants.dart';
import '../models/login_dto.dart';
import '../models/jwt_response_dto.dart';

import 'package:flutter/material.dart';
import '../models/user_profile_model.dart';

class AuthService extends ChangeNotifier {
  static final AuthService _instance = AuthService._internal();
  factory AuthService({http.Client? httpClient}) {
    _instance._httpClient = httpClient ?? http.Client();
    return _instance;
  }
  AuthService._internal();

  late http.Client _httpClient;

  static const String _tokenKey = 'auth_token';
  UserProfile? _currentUser;
  bool _mockLoggedIn = false;

  UserProfile? get currentUser => _currentUser;

  Future<bool> login(LoginDto loginDto) async {
    try {
      final url =
          Uri.parse('${ApiConstants.baseUrl}${ApiConstants.loginEndpoint}');
      final response = await _httpClient.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(loginDto.toJson()),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final jwtResponse = JwtResponseDto.fromJson(data);

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(_tokenKey, jwtResponse.token);

        // Cargar el perfil del usuario después de loguearse
        await loadCurrentUser();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  void setMockLoggedIn(bool value) {
    _mockLoggedIn = value;
    notifyListeners();
  }

  Future<bool> isLoggedIn() async {
    if (_mockLoggedIn) return true;
    final prefs = await SharedPreferences.getInstance();
    return prefs.containsKey(_tokenKey);
  }

  Future<void> loadCurrentUser() async {
    final token = await getToken();
    if (token == null) {
      _currentUser = null;
      notifyListeners();
      return;
    }

    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/logued');
      final response = await http.get(url, headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      });

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        _currentUser = UserProfile.fromJson(data);
      } else {
        _currentUser = null;
      }
      notifyListeners();
    } catch (e) {
      print('Error al cargar perfil de usuario: $e');
      _currentUser = null;
      notifyListeners();
    }
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    _currentUser = null;
    notifyListeners();
  }

  Future<bool> registerUser(Map<String, dynamic> registerData) async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/register');
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(registerData),
      );

      if (response.statusCode == 201) {
        return true;
      } else {
        print('Error al registrar usuario: ${response.body}');
        return false;
      }
    } catch (e) {
      print('Excepción al registrar usuario: $e');
      return false;
    }
  }

  Future<bool> updateUser(int userId, Map<String, dynamic> updateData) async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/users/$userId');
      final token = await getToken();
      final response = await http.put(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(updateData),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Error al actualizar usuario: $e');
      return false;
    }
  }

  Future<bool> deleteUser(int userId) async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/users/$userId');
      final token = await getToken();
      final response = await http.delete(
        url,
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      return response.statusCode == 204;
    } catch (e) {
      print('Error al eliminar usuario: $e');
      return false;
    }
  }
}
