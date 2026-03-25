import 'dart:convert';
import 'package:http/http.dart' as http;
import '../utils/api_constants.dart';
import '../models/noticia_model.dart';
import 'auth_service.dart';

class ApiService {
  final AuthService _authService = AuthService();

  Future<Map<String, String>> _getHeaders() async {
    final token = await _authService.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  // ── NOTICIAS ─────────────────────────────────────────────────────────────
  Future<List<Noticia>> getNoticias() async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/noticias');
      final headers = await _getHeaders();
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map<Noticia>((json) => Noticia.fromJson(json)).toList();
      }
      throw Exception('Error al cargar noticias: ${response.statusCode}');
    } catch (e) {
      print('ApiService.getNoticias error: $e');
      return <Noticia>[];
    }
  }

  String getNoticiaImageUrl(String noticiaId) =>
      '${ApiConstants.baseUrl}/noticias/imagen/$noticiaId';

  // ── PERFIL ────────────────────────────────────────────────────────────────
  Future<dynamic> getUserProfile() async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/logued');
      final headers = await _getHeaders();
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) return jsonDecode(response.body);
      return null;
    } catch (e) {
      print('ApiService.getUserProfile error: $e');
      return null;
    }
  }

  // ── CALIFICACIONES ────────────────────────────────────────────────────────
  Future<List<dynamic>> getAllCalificaciones() async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/calificaciones');
      final headers = await _getHeaders();
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) return jsonDecode(response.body);
      return [];
    } catch (e) {
      print('ApiService.getCalificaciones error: $e');
      return [];
    }
  }

  // ── HORARIOS ──────────────────────────────────────────────────────────────
  Future<List<dynamic>> getAllHorarios() async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/horario');
      final headers = await _getHeaders();
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) return jsonDecode(response.body);
      return [];
    } catch (e) {
      print('ApiService.getAllHorarios error: $e');
      return [];
    }
  }

  // ── ESTUDIANTES ───────────────────────────────────────────────────────────
  Future<List<dynamic>> getAllEstudiantes() async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/estudiantes');
      final headers = await _getHeaders();
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) return jsonDecode(response.body);
      return [];
    } catch (e) {
      print('ApiService.getAllEstudiantes error: $e');
      return [];
    }
  }

  // ── USUARIOS (Admin) ──────────────────────────────────────────────────────
  Future<List<dynamic>> getUsers() async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/register/users');
      final headers = await _getHeaders();
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) return jsonDecode(response.body);
      return [];
    } catch (e) {
      print('ApiService.getUsers error: $e');
      return [];
    }
  }


  Future<bool> createUser(Map<String, dynamic> userData) async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/register');
      final headers = await _getHeaders();
      final response = await http.post(url, headers: headers, body: jsonEncode(userData));
      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      print('ApiService.createUser error: $e');
      return false;
    }
  }

  Future<bool> updateUser(int id, Map<String, dynamic> userData) async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/register/users/$id');
      final headers = await _getHeaders();
      final response = await http.put(url, headers: headers, body: jsonEncode(userData));
      return response.statusCode == 200;
    } catch (e) {
      print('ApiService.updateUser error: $e');
      return false;
    }
  }

  Future<bool> deleteUser(int id) async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/register/users/$id');
      final headers = await _getHeaders();
      final response = await http.delete(url, headers: headers);
      return response.statusCode == 200;
    } catch (e) {
      print('ApiService.deleteUser error: $e');
      return false;
    }
  }

  Future<List<dynamic>> getRoles() async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/register/roles');
      final headers = await _getHeaders();
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) return jsonDecode(response.body);
      return [];
    } catch (e) {
      print('ApiService.getRoles error: $e');
      return [];
    }
  }

  // ── NOTICIAS (Admin CRUD) ────────────────────────────────────────────────
  Future<bool> createNoticia({
    required String titulo,
    required String contenido,
    String? imagenPath,
    String? videoPath,
  }) async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/noticias/crear');
      final token = await _authService.getToken();
      
      var request = http.MultipartRequest('POST', url);
      request.headers['Authorization'] = 'Bearer $token';
      request.fields['titulo'] = titulo;
      request.fields['contenido'] = contenido;

      if (imagenPath != null && imagenPath.isNotEmpty) {
        request.files.add(await http.MultipartFile.fromPath('imagen', imagenPath));
      }
      if (videoPath != null && videoPath.isNotEmpty) {
        request.files.add(await http.MultipartFile.fromPath('video', videoPath));
      }

      final streamedResponse = await request.send();
      return streamedResponse.statusCode == 201 || streamedResponse.statusCode == 200;
    } catch (e) {
      print('ApiService.createNoticia error: $e');
      return false;
    }
  }

  Future<bool> deleteNoticia(String id) async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/noticias/eliminar/$id');
      final headers = await _getHeaders();
      final response = await http.delete(url, headers: headers);
      return response.statusCode == 200 || response.statusCode == 204;
    } catch (e) {
      print('ApiService.deleteNoticia error: $e');
      return false;
    }
  }

  // ── DOCENTES ──────────────────────────────────────────────────────────────
  Future<List<dynamic>> getAllDocentes() async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/docentes');
      final headers = await _getHeaders();
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) return jsonDecode(response.body);
      return [];
    } catch (e) {
      print('ApiService.getAllDocentes error: $e');
      return [];
    }
  }

  // ── ASISTENCIA POR CURSO ──────────────────────────────────────────────────
  Future<List<dynamic>> getAsistenciasPorCurso(int idNivelDetalleCurso) async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/asistencia/curso/$idNivelDetalleCurso');
      final headers = await _getHeaders();
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) return jsonDecode(response.body);
      return [];
    } catch (e) {
      print('ApiService.getAsistenciasPorCurso error: $e');
      return [];
    }
  }

  // ── REGISTRAR ASISTENCIA ─────────────────────────────────────────────────
  Future<bool> registrarAsistencia(Map<String, dynamic> asistencia) async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/asistencia/registrar');
      final headers = await _getHeaders();
      final response = await http.post(url, headers: headers, body: jsonEncode(asistencia));
      return response.statusCode == 200;
    } catch (e) {
      print('ApiService.registrarAsistencia error: $e');
      return false;
    }
  }

  // ── PREDICCIONES HISTORIAL ────────────────────────────────────────────────
  Future<List<dynamic>> getHistorialPredicciones() async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/historial');
      final headers = await _getHeaders();
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) return jsonDecode(response.body);
      return [];
    } catch (e) {
      print('ApiService.getHistorialPredicciones error: $e');
      return [];
    }
  }

  // ── CURSOS (DocenteNivelDetalleCurso) ─────────────────────────────────────
  Future<List<dynamic>> getDocenteNivelDetalleCursos() async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/docente-nivel-detalle-curso');
      final headers = await _getHeaders();
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) return jsonDecode(response.body);
      return [];
    } catch (e) {
      print('ApiService.getDocenteNivelDetalleCursos error: $e');
      return [];
    }
  }

  // ── PERIODO ACTIVO ────────────────────────────────────────────────────────
  Future<dynamic> getPeriodoActivo() async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/periodos/activo');
      final headers = await _getHeaders();
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) return jsonDecode(response.body);
      return null;
    } catch (e) {
      print('ApiService.getPeriodoActivo error: $e');
      return null;
    }
  }

  // ── INSCRIPCIONES (Matriculas) ───────────────────────────────────────────
  Future<List<dynamic>> getAllInscripciones() async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/inscripciones');
      final headers = await _getHeaders();
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) return jsonDecode(response.body);
      return [];
    } catch (e) {
      print('ApiService.getAllInscripciones error: $e');
      return [];
    }
  }

  // ── PERIODOS ──────────────────────────────────────────────────────────────
  Future<List<dynamic>> getAllPeriodos() async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/periodos');
      final headers = await _getHeaders();
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) return jsonDecode(response.body);
      return [];
    } catch (e) {
      print('ApiService.getAllPeriodos error: $e');
      return [];
    }
  }

  // ── NIVELES/GRADOS ────────────────────────────────────────────────────────
  Future<List<dynamic>> getAllNiveles() async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/nivel');
      final headers = await _getHeaders();
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) return jsonDecode(response.body);
      return [];
    } catch (e) {
      print('ApiService.getAllNiveles error: $e');
      return [];
    }
  }

  Future<List<dynamic>> getAllNivelesDetalles() async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/nivel-detalle');
      final headers = await _getHeaders();
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) return jsonDecode(response.body);
      return [];
    } catch (e) {
      print('ApiService.getAllNivelesDetalles error: $e');
      return [];
    }
  }

  // ── CHAT ────────────────────────────────────────────────────────────────
  Future<List<dynamic>> getChatHistory(String user1, String user2) async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/historial/$user1/$user2');
      final headers = await _getHeaders();
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) return jsonDecode(response.body);
      return [];
    } catch (e) {
      print('ApiService.getChatHistory error: $e');
      return [];
    }
  }

}
