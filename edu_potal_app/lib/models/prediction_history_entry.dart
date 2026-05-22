import 'dart:convert';

class PredictionHistoryEntry {
  final String id;
  final DateTime fecha;

  // Datos de entrada
  final int? documento;
  final String nombreEstudiante;
  final int edad;
  final String genero;
  final int horasEstudioSemanal;
  final double asistencia;
  final double promedioParciales;
  final String participacionClases;
  final String usoPlataformaVirtual;
  final String antecedentesPerdida;
  final String apoyoFamiliar;
  final int cargaAcademica;
  final String problemasPersonales;

  // Resultado de la predicción
  final String prediccion;
  final String confianza;
  final bool esRiesgoAlto;
  final List<dynamic> factoresRiesgo;
  final String modelo;

  PredictionHistoryEntry({
    required this.id,
    required this.fecha,
    this.documento,
    this.nombreEstudiante = '',
    required this.edad,
    required this.genero,
    required this.horasEstudioSemanal,
    required this.asistencia,
    required this.promedioParciales,
    required this.participacionClases,
    required this.usoPlataformaVirtual,
    required this.antecedentesPerdida,
    required this.apoyoFamiliar,
    required this.cargaAcademica,
    required this.problemasPersonales,
    required this.prediccion,
    required this.confianza,
    required this.esRiesgoAlto,
    required this.factoresRiesgo,
    required this.modelo,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'fecha': fecha.toIso8601String(),
        'documento': documento,
        'nombreEstudiante': nombreEstudiante,
        'edad': edad,
        'genero': genero,
        'horasEstudioSemanal': horasEstudioSemanal,
        'asistencia': asistencia,
        'promedioParciales': promedioParciales,
        'participacionClases': participacionClases,
        'usoPlataformaVirtual': usoPlataformaVirtual,
        'antecedentesPerdida': antecedentesPerdida,
        'apoyoFamiliar': apoyoFamiliar,
        'cargaAcademica': cargaAcademica,
        'problemasPersonales': problemasPersonales,
        'prediccion': prediccion,
        'confianza': confianza,
        'esRiesgoAlto': esRiesgoAlto,
        'factoresRiesgo': jsonEncode(factoresRiesgo),
        'modelo': modelo,
      };

  factory PredictionHistoryEntry.fromJson(Map<String, dynamic> json) {
    List<dynamic> factores = [];
    try {
      factores = jsonDecode(json['factoresRiesgo'] ?? '[]');
    } catch (_) {}

    return PredictionHistoryEntry(
      id: json['id'] ?? '',
      fecha: DateTime.tryParse(json['fecha'] ?? '') ?? DateTime.now(),
      documento: json['documento'],
      nombreEstudiante: json['nombreEstudiante'] ?? '',
      edad: json['edad'] ?? 0,
      genero: json['genero'] ?? '',
      horasEstudioSemanal: json['horasEstudioSemanal'] ?? 0,
      asistencia: (json['asistencia'] ?? 0).toDouble(),
      promedioParciales: (json['promedioParciales'] ?? 0).toDouble(),
      participacionClases: json['participacionClases'] ?? '',
      usoPlataformaVirtual: json['usoPlataformaVirtual'] ?? '',
      antecedentesPerdida: json['antecedentesPerdida'] ?? '',
      apoyoFamiliar: json['apoyoFamiliar'] ?? '',
      cargaAcademica: json['cargaAcademica'] ?? 0,
      problemasPersonales: json['problemasPersonales'] ?? '',
      prediccion: json['prediccion'] ?? '',
      confianza: json['confianza'] ?? '',
      esRiesgoAlto: json['esRiesgoAlto'] ?? false,
      factoresRiesgo: factores,
      modelo: json['modelo'] ?? '',
    );
  }
}
