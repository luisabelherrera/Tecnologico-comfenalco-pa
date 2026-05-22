import 'prediccion_response.dart';
import 'prediction_history_entry.dart';

class PredictionWithHistory {
  final PrediccionResponse prediccionActual;
  final List<PredictionHistoryEntry> historicoPredicciones;
  final String? tendencia; // 'mejora' | 'empeora' | 'estable' | null
  final double? porcentajeCambio; // Cambio en confianza respecto a predicción anterior

  PredictionWithHistory({
    required this.prediccionActual,
    this.historicoPredicciones = const [],
    this.tendencia,
    this.porcentajoCambio,
  });

  /// Obtiene la predicción anterior si existe
  PredictionHistoryEntry? get prediccionAnterior {
    if (historicoPredicciones.isEmpty) return null;
    return historicoPredicciones.first;
  }

  /// Calcula la tendencia basada en el historial
  String calcularTendencia() {
    if (historicoPredicciones.length < 2) return 'sin_datos';

    final actual = prediccionActual.confianza;
    final anterior = prediccionAnterior?.confianza ?? '';

    final actualNum = double.tryParse(actual) ?? 0.0;
    final anteriorNum = double.tryParse(anterior) ?? 0.0;

    if (anteriorNum == 0) return 'sin_datos';

    if (actualNum > anteriorNum + 5) {
      return 'mejora';
    } else if (actualNum < anteriorNum - 5) {
      return 'empeora';
    } else {
      return 'estable';
    }
  }

  /// Calcula el porcentaje de cambio en confianza
  double calcularPorcentajeCambio() {
    if (historicoPredicciones.isEmpty) return 0.0;

    final anterior = prediccionAnterior?.confianza ?? '0';
    final actual = prediccionActual.confianza;

    final actualNum = double.tryParse(actual) ?? 0.0;
    final anteriorNum = double.tryParse(anterior) ?? 0.0;

    if (anteriorNum == 0) return 0.0;

    return ((actualNum - anteriorNum) / anteriorNum) * 100;
  }

  /// Obtiene el conteo de predicciones de alto riesgo en el historial
  int obtenerConteoPredRiesgoAlto() {
    return historicoPredicciones.where((e) => e.esRiesgoAlto).length;
  }

  /// Obtiene el promedio de confianza en el historial
  double obtenerPromedioConfianza() {
    if (historicoPredicciones.isEmpty) return 0.0;

    double suma = 0;
    for (var entry in historicoPredicciones) {
      final val = double.tryParse(entry.confianza) ?? 0.0;
      suma += val;
    }

    return suma / historicoPredicciones.length;
  }

  /// Verifica si la predicción actual es consistente con el historial
  bool esConsistenteConHistorial() {
    if (historicoPredicciones.isEmpty) return true;

    final prediccionActualEsAlto = prediccionActual.confianza != 'Bajo Riesgo' &&
        prediccionActual.confianza != 'Riesgo Bajo';

    final historialEsAlto =
        historicoPredicciones.every((e) => e.esRiesgoAlto);
    final historialEsBajo =
        historicoPredicciones.every((e) => !e.esRiesgoAlto);

    if (historialEsAlto && prediccionActualEsAlto) return true;
    if (historialEsBajo && !prediccionActualEsAlto) return true;

    return false;
  }

  /// Obtiene una descripción textual de la tendencia
  String obtenerDescripcionTendencia() {
    final tend = tendencia ?? calcularTendencia();
    switch (tend) {
      case 'mejora':
        return 'El estudiante muestra mejoría en sus indicadores académicos';
      case 'empeora':
        return 'Se detecta deterioro en los indicadores académicos';
      case 'estable':
        return 'Los indicadores académicos se mantienen estables';
      default:
        return 'Sin datos históricos de predicciones anteriores';
    }
  }
}
