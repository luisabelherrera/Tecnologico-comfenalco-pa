import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/prediction_history_entry.dart';

class PredictionHistoryService {
  static const String _storageKey = 'prediction_history_v1';
  static const int _maxEntries = 100; // Límite para no saturar el storage

  Future<List<PredictionHistoryEntry>> getHistory() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getStringList(_storageKey) ?? [];
      return raw
          .map((e) => PredictionHistoryEntry.fromJson(jsonDecode(e)))
          .toList()
          .reversed
          .toList(); // Más reciente primero
    } catch (e) {
      return [];
    }
  }

  /// Obtiene el historial de predicciones de un estudiante específico
  Future<List<PredictionHistoryEntry>> getHistoryByStudent(
      int? documento) async {
    if (documento == null) return [];
    try {
      final history = await getHistory();
      return history
          .where((entry) => entry.documento == documento)
          .toList();
    } catch (e) {
      return [];
    }
  }

  /// Obtiene las últimas N predicciones de un estudiante
  Future<List<PredictionHistoryEntry>> getRecentHistoryByStudent(
      int? documento, int limit) async {
    final history = await getHistoryByStudent(documento);
    return history.take(limit).toList();
  }

  /// Calcula la tendencia de riesgo para un estudiante
  Future<String> getTrendAnalysis(int? documento) async {
    if (documento == null) return 'sin_datos';

    final history = await getHistoryByStudent(documento);
    if (history.length < 2) return 'sin_datos';

    // Comparar últimas dos predicciones
    final actual = history.first.esRiesgoAlto;
    final anterior = history[1].esRiesgoAlto;

    if (!actual && anterior) {
      return 'mejora';
    } else if (actual && !anterior) {
      return 'empeora';
    } else {
      return 'estable';
    }
  }

  /// Obtiene el porcentaje de predicciones de alto riesgo para un estudiante
  Future<double> getRiskPercentage(int? documento) async {
    if (documento == null) return 0.0;

    final history = await getHistoryByStudent(documento);
    if (history.isEmpty) return 0.0;

    final riesgoAlto = history.where((e) => e.esRiesgoAlto).length;
    return (riesgoAlto / history.length) * 100;
  }

  /// Calcula el promedio de confianza para un estudiante
  Future<double> getAverageConfidence(int? documento) async {
    if (documento == null) return 0.0;

    final history = await getHistoryByStudent(documento);
    if (history.isEmpty) return 0.0;

    double suma = 0;
    int count = 0;
    for (var entry in history) {
      final val = double.tryParse(entry.confianza) ?? 0.0;
      suma += val;
      count++;
    }

    return count > 0 ? suma / count : 0.0;
  }

  /// Obtiene estadísticas detalladas para un estudiante
  Future<Map<String, dynamic>> getStudentStats(int? documento) async {
    if (documento == null) return {};

    final history = await getHistoryByStudent(documento);
    final total = history.length;
    final riesgoAlto = history.where((e) => e.esRiesgoAlto).length;
    final riegoBajo = total - riesgoAlto;
    final trend = await getTrendAnalysis(documento);
    final avgConfidence = await getAverageConfidence(documento);

    return {
      'total': total,
      'riesgoAlto': riesgoAlto,
      'riesgoBajo': riegoBajo,
      'tendencia': trend,
      'promedioConfianza': avgConfidence,
      'porcentajeAlto': (riesgoAlto / total * 100).toStringAsFixed(1),
    };
  }

  Future<void> saveEntry(PredictionHistoryEntry entry) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getStringList(_storageKey) ?? [];
      raw.add(jsonEncode(entry.toJson()));

      // Respetar el límite máximo (eliminar los más antiguos)
      if (raw.length > _maxEntries) {
        raw.removeRange(0, raw.length - _maxEntries);
      }

      await prefs.setStringList(_storageKey, raw);
    } catch (e) {
      // Silently fail — historial es funcionalidad auxiliar
    }
  }

  Future<void> deleteEntry(String id) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getStringList(_storageKey) ?? [];
      final updated = raw.where((e) {
        try {
          final decoded = jsonDecode(e);
          return decoded['id'] != id;
        } catch (_) {
          return true;
        }
      }).toList();
      await prefs.setStringList(_storageKey, updated);
    } catch (_) {}
  }

  Future<void> clearAll() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_storageKey);
  }

  /// Estadísticas generales (todas las predicciones)
  Future<Map<String, int>> getStats() async {
    final history = await getHistory();
    final total = history.length;
    final riesgoAlto = history.where((e) => e.esRiesgoAlto).length;
    final riegoBajo = total - riesgoAlto;
    return {'total': total, 'riesgoAlto': riesgoAlto, 'riesgoBajo': riegoBajo};
  }
}
