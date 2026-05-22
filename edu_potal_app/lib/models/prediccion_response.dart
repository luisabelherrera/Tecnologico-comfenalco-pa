class PrediccionResponse {
  final String prediccion;
  final String confianza;
  final Map<String, dynamic> probabilidades;
  final List<dynamic> factoresRiesgoPrincipales;
  final String modelo;
  final List<Map<String, dynamic>>? historicoPredicciones;
  final String? tendencia;
  final double? porcentajeCambio;

  PrediccionResponse({
    required this.prediccion,
    required this.confianza,
    required this.probabilidades,
    required this.factoresRiesgoPrincipales,
    required this.modelo,
    this.historicoPredicciones,
    this.tendencia,
    this.porcentajeCambio,
  });

  factory PrediccionResponse.fromJson(Map<String, dynamic> json) {
    return PrediccionResponse(
      prediccion: json['prediccion'] ?? '',
      confianza: json['confianza'] ?? '',
      probabilidades: json['probabilidades'] ?? {},
      factoresRiesgoPrincipales: json['factores_riesgo_principales'] ?? [],
      modelo: json['modelo'] ?? '',
      historicoPredicciones: json['historicoPredicciones'] != null
          ? List<Map<String, dynamic>>.from(json['historicoPredicciones'])
          : null,
      tendencia: json['tendencia'],
      porcentajeCambio: json['porcentajeCambio'] != null
          ? double.tryParse(json['porcentajeCambio'].toString())
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
    'prediccion': prediccion,
    'confianza': confianza,
    'probabilidades': probabilidades,
    'factores_riesgo_principales': factoresRiesgoPrincipales,
    'modelo': modelo,
    'historicoPredicciones': historicoPredicciones,
    'tendencia': tendencia,
    'porcentajeCambio': porcentajeCambio,
  };
}
