import 'dart:convert';
import 'package:http/http.dart' as http;
import '../utils/api_constants.dart';
import '../models/noticia_model.dart';
import '../models/datos_estudiante_request.dart';
import '../models/prediccion_response.dart';
import 'auth_service.dart';
import 'dart:developer' as dev;

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
      dev.log('ApiService.getNoticias error: $e');
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
      dev.log('ApiService.getUserProfile error: $e');
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
      dev.log('ApiService.getCalificaciones error: $e');
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
      dev.log('ApiService.getAllHorarios error: $e');
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
      dev.log('ApiService.getAllEstudiantes error: $e');
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
      dev.log('ApiService.getUsers error: $e');
      return [];
    }
  }

  Future<bool> createUser(Map<String, dynamic> userData) async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/register');
      final headers = await _getHeaders();
      final response =
          await http.post(url, headers: headers, body: jsonEncode(userData));
      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      dev.log('ApiService.createUser error: $e');
      return false;
    }
  }

  Future<bool> updateUser(int id, Map<String, dynamic> userData) async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/register/users/$id');
      final headers = await _getHeaders();
      final response =
          await http.put(url, headers: headers, body: jsonEncode(userData));
      return response.statusCode == 200;
    } catch (e) {
      dev.log('ApiService.updateUser error: $e');
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
      dev.log('ApiService.deleteUser error: $e');
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
      dev.log('ApiService.getRoles error: $e');
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
        request.files
            .add(await http.MultipartFile.fromPath('imagen', imagenPath));
      }
      if (videoPath != null && videoPath.isNotEmpty) {
        request.files
            .add(await http.MultipartFile.fromPath('video', videoPath));
      }

      final streamedResponse = await request.send();
      return streamedResponse.statusCode == 201 ||
          streamedResponse.statusCode == 200;
    } catch (e) {
      dev.log('ApiService.createNoticia error: $e');
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
      dev.log('ApiService.deleteNoticia error: $e');
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
      dev.log('ApiService.getAllDocentes error: $e');
      return [];
    }
  }

  // ── ASISTENCIA POR CURSO ──────────────────────────────────────────────────
  Future<List<dynamic>> getAsistenciasPorCurso(int idNivelDetalleCurso) async {
    try {
      final url = Uri.parse(
          '${ApiConstants.baseUrl}/asistencia/curso/$idNivelDetalleCurso');
      final headers = await _getHeaders();
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) return jsonDecode(response.body);
      return [];
    } catch (e) {
      dev.log('ApiService.getAsistenciasPorCurso error: $e');
      return [];
    }
  }

  // ── REGISTRAR ASISTENCIA ─────────────────────────────────────────────────
  Future<bool> registrarAsistencia(Map<String, dynamic> asistencia) async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/asistencia/registrar');
      final headers = await _getHeaders();
      final response =
          await http.post(url, headers: headers, body: jsonEncode(asistencia));
      return response.statusCode == 200;
    } catch (e) {
      dev.log('ApiService.registrarAsistencia error: $e');
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
      dev.log('ApiService.getHistorialPredicciones error: $e');
      return [];
    }
  }

  // ── CURSOS (DocenteNivelDetalleCurso) ─────────────────────────────────────
  Future<List<dynamic>> getDocenteNivelDetalleCursos() async {
    try {
      final url =
          Uri.parse('${ApiConstants.baseUrl}/docente-nivel-detalle-curso');
      final headers = await _getHeaders();
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) return jsonDecode(response.body);
      return [];
    } catch (e) {
      dev.log('ApiService.getDocenteNivelDetalleCursos error: $e');
      return [];
    }
  }

  // ── CURSOS ──────────────────────────────────────────────────────────────
  Future<List<dynamic>> getAllCursos() async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/cursos');
      final headers = await _getHeaders();
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) return jsonDecode(response.body);
      return [];
    } catch (e) {
      dev.log('ApiService.getAllCursos error: $e');
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
      dev.log('ApiService.getPeriodoActivo error: $e');
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
      dev.log('ApiService.getAllInscripciones error: $e');
      return [];
    }
  }

  // ── PERIODOS ──────────────────────────────────────────────────────────────
  Future<List<dynamic>> getAllPeriodos() async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/periodo');
      final headers = await _getHeaders();
      final response = await http.get(url, headers: headers);
      if (response.statusCode == 200) return jsonDecode(response.body);
      return [];
    } catch (e) {
      dev.log('ApiService.getAllPeriodos error: $e');
      return [];
    }
  }

  Future<bool> createPeriodo(Map<String, dynamic> data) async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/periodo');
      final headers = await _getHeaders();
      final response =
          await http.post(url, headers: headers, body: jsonEncode(data));
      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      dev.log('ApiService.createPeriodo error: $e');
      return false;
    }
  }

  Future<bool> updatePeriodo(int id, Map<String, dynamic> data) async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/periodo/$id');
      final headers = await _getHeaders();
      final response =
          await http.put(url, headers: headers, body: jsonEncode(data));
      return response.statusCode == 200;
    } catch (e) {
      dev.log('ApiService.updatePeriodo error: $e');
      return false;
    }
  }

  Future<bool> deletePeriodo(int id) async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/periodo/$id');
      final headers = await _getHeaders();
      final response = await http.delete(url, headers: headers);
      return response.statusCode == 200 || response.statusCode == 204;
    } catch (e) {
      dev.log('ApiService.deletePeriodo error: $e');
      return false;
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
      dev.log('ApiService.getAllNiveles error: $e');
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
      dev.log('ApiService.getAllNivelesDetalles error: $e');
      return [];
    }
  }

  // ── GENERIC CRUD ──────────────────────────────────────────────────────────
  Future<bool> createEntity(String endpoint, Map<String, dynamic> data) async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}$endpoint');
      final headers = await _getHeaders();
      final response =
          await http.post(url, headers: headers, body: jsonEncode(data));
      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      dev.log('ApiService.createEntity error: $e');
      return false;
    }
  }

  Future<bool> updateEntity(
      String endpoint, int id, Map<String, dynamic> data) async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}$endpoint/$id');
      final headers = await _getHeaders();
      final response =
          await http.put(url, headers: headers, body: jsonEncode(data));
      return response.statusCode == 200;
    } catch (e) {
      dev.log('ApiService.updateEntity error: $e');
      return false;
    }
  }

  Future<bool> deleteEntity(String endpoint, int id) async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}$endpoint/$id');
      final headers = await _getHeaders();
      final response = await http.delete(url, headers: headers);
      return response.statusCode == 200 || response.statusCode == 204;
    } catch (e) {
      dev.log('ApiService.deleteEntity error: $e');
      return false;
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
      dev.log('ApiService.getChatHistory error: $e');
      return [];
    }
  }

  /// Verifica si el microservicio de IA está corriendo
  Future<bool> checkHealthFastAPI() async {
    try {
      // Apuntamos directo a FastAPI (no requiere _getHeaders porque no usa JWT)
      final response = await http
          .get(Uri.parse('${ApiConstants.baseUrlFastAPI}/health'))
          .timeout(const Duration(seconds: 5)); // 5 seg por si el Cloud Run está "dormido" (Cold Start)

      return response.statusCode == 200;
    } catch (e) {
      dev.log('ApiService.checkHealthFastAPI error: $e');
      return false;
    }
  }

  /// Dispara el re-entrenamiento del modelo usando la base de datos
  Future<Map<String, dynamic>> reentrenarModeloIA() async {
    try {
      // Apuntamos directo a FastAPI
      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrlFastAPI}/entrenar-desde-bd'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(const Duration(minutes: 3)); // 3 minutos porque generar el ARFF toma tiempo

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception('Error al reentrenar: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      throw Exception('Fallo la conexión con FastAPI: $e');
    }
  }

  // ── PREDICCIÓN ML (FastAPI) ────────────────────────────────────────────────
  Future<PrediccionResponse?> predecir(DatosEstudianteRequest request) async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrlFastAPI}/predecir');
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(request.toJson()),
      ).timeout(const Duration(seconds: 15));

      if (response.statusCode == 200) {
        return PrediccionResponse.fromJson(jsonDecode(response.body));
      } else {
        dev.log('ApiService.predecir error: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      dev.log('ApiService.predecir error: $e');
      return null;
    }
  }

  Future<Map<String, dynamic>?> obtenerMetricasModelo() async {
    try {
      final url = Uri.parse('${ApiConstants.baseUrlFastAPI}/metricas');
      final response = await http.get(url).timeout(const Duration(seconds: 10));

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      dev.log('ApiService.obtenerMetricasModelo error: $e');
      return null;
    }
  }

  // ── MÉTODOS FILTRADOS POR DOCENTE (SEGURIDAD) ──────────────────────────────
  /// Obtiene solo los cursos del docente autenticado
  Future<List<dynamic>> getDocenteCursos(int idDocente) async {
    try {
      // Intentar obtener cursos filtrados del backend
      final url = Uri.parse(
        '${ApiConstants.baseUrl}/docente-nivel-detalle-curso?idDocente=$idDocente',
      );
      final headers = await _getHeaders();
      final response = await http.get(url, headers: headers);

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }

      // Si el backend no soporta filtro, traer todos y filtrar en frontend
      final allCourses = await getDocenteNivelDetalleCursos();
      return allCourses
          .where((c) =>
              c['docente'] != null &&
              c['docente']['idDocente'] == idDocente)
          .toList();
    } catch (e) {
      dev.log('ApiService.getDocenteCursos error: $e');
      // Fallback: obtener todos y filtrar
      try {
        final allCourses = await getDocenteNivelDetalleCursos();
        return allCourses
            .where((c) =>
                c['docente'] != null &&
                c['docente']['idDocente'] == idDocente)
            .toList();
      } catch (e2) {
        dev.log('ApiService.getDocenteCursos fallback error: $e2');
        return [];
      }
    }
  }

  /// Obtiene solo los estudiantes de los cursos del docente
  Future<List<dynamic>> getEstudiantesByDocente(int idDocente) async {
    try {
      // Obtener cursos del docente
      final cursos = await getDocenteCursos(idDocente);

      if (cursos.isEmpty) return [];

      // Recopilar IDs de estudiantes de todos los cursos
      final Set<int> estudianteIds = {};

      for (var curso in cursos) {
        final idCurso = curso['idNivelDetalleCurso'] as int?;
        if (idCurso == null) continue;

        // Obtener asistencia para este curso (contiene estudiantes)
        final asistencias = await getAsistenciasPorCurso(idCurso);
        for (var asistencia in asistencias) {
          final estudiante = asistencia['estudiante'] as Map<String, dynamic>?;
          if (estudiante != null) {
            final idEst = estudiante['idEstudiante'] as int?;
            if (idEst != null) estudianteIds.add(idEst);
          }
        }
      }

      if (estudianteIds.isEmpty) return [];

      // Filtrar estudiantes globales por IDs encontrados
      final todosEstudiantes = await getAllEstudiantes();
      return todosEstudiantes
          .where((e) =>
              estudianteIds.contains(e['idEstudiante'] ?? e['id']))
          .toList();
    } catch (e) {
      dev.log('ApiService.getEstudiantesByDocente error: $e');
      return [];
    }
  }

  /// Obtiene solo las calificaciones de los estudiantes del docente
  Future<List<dynamic>> getCalificacionesByDocente(int idDocente) async {
    try {
      // Obtener estudiantes del docente
      final estudiantes = await getEstudiantesByDocente(idDocente);
      if (estudiantes.isEmpty) return [];

      // Obtener IDs de estudiantes
      final Set<int> estudianteIds = {
        for (var e in estudiantes) e['idEstudiante'] ?? e['id'] as int
      };

      // Obtener todas las calificaciones
      final todasCalificaciones = await getAllCalificaciones();

      // Filtrar por estudiantes del docente
      return todasCalificaciones
          .where((c) {
            final estId = c['estudiante']?['idEstudiante'] as int?;
            return estId != null && estudianteIds.contains(estId);
          })
          .toList();
    } catch (e) {
      dev.log('ApiService.getCalificacionesByDocente error: $e');
      return [];
    }
  }

  /// Obtiene solo la asistencia de los estudiantes del docente
  Future<List<dynamic>> getAsistenciaByDocente(int idDocente) async {
    try {
      // Obtener cursos del docente
      final cursos = await getDocenteCursos(idDocente);
      if (cursos.isEmpty) return [];

      // Recopilar asistencia de todos los cursos
      final List<dynamic> asistenciaTotal = [];
      for (var curso in cursos) {
        final idCurso = curso['idNivelDetalleCurso'] as int?;
        if (idCurso == null) continue;

        final asistencias = await getAsistenciasPorCurso(idCurso);
        asistenciaTotal.addAll(asistencias);
      }

      return asistenciaTotal;
    } catch (e) {
      dev.log('ApiService.getAsistenciaByDocente error: $e');
      return [];
    }
  }

  /// Valida que el docente autenticado tenga acceso a un recurso específico
  Future<bool> validateTeacherAccess(int requestedDocente) async {
    try {
      final profile = await getUserProfile();
      if (profile == null) return false;

      final currentDocente = profile['docente'] as Map<String, dynamic>?;
      if (currentDocente == null) return false;

      final currentDocenteId = currentDocente['idDocente'] as int?;
      return currentDocenteId == requestedDocente;
    } catch (e) {
      dev.log('ApiService.validateTeacherAccess error: $e');
      return false;
    }
  }
}
