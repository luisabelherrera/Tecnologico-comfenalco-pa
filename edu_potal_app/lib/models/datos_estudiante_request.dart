class DatosEstudianteRequest {
  final int? documento;
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

  DatosEstudianteRequest({
    this.documento,
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
  });

  Map<String, dynamic> toJson() {
    return {
      'documento': documento,
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
    };
  }
}
