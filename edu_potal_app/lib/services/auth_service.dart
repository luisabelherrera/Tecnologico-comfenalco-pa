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
  factory AuthService() => _instance;
  AuthService._internal();

  static const String _tokenKey = 'auth_token';
  UserProfile? _currentUser;

  UserProfile? get currentUser => _currentUser;

  Future<bool> login(LoginDto loginDto) async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}${ApiConstants.loginEndpoint}');
      final response = await http.post(
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
      } else {
        return false;
      }
    } catch (e) {
      print('Login error: $e');
      return false;
    }
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

  Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }
}
