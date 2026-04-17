import 'dart:developer' as dev;

class CalificacionModel {
  final int idCalificacion;
  final double nota;
  final String descripcion;
  final String cursoDescripcion;
  final String nombreDocente;

  CalificacionModel({
    required this.idCalificacion,
    required this.nota,
    required this.descripcion,
    required this.cursoDescripcion,
    required this.nombreDocente,
  });

  factory CalificacionModel.fromJson(Map<String, dynamic> json) {
    String cursoDesc = 'Sin Curso Asignado';
    String desc = 'Registro de Nota';
    String docente = 'Docente Desconocido';

    if (json['curricular'] != null) {
      desc = json['curricular']['descripcion'] ?? desc;
      try {
        final ndc = json['curricular']['docenteNivelDetalleCurso'];
        if (ndc != null) {
          cursoDesc =
              ndc['nivelDetalleCurso']['curso']['descripcion'] ?? cursoDesc;
          final doc = ndc['docente'];
          if (doc != null) {
            docente = '${doc['nombres']} ${doc['apellidos']}';
          }
        }
      } catch (e) {
        dev.log('Mapeo de curso en calificacion fallo: $e');
      }
    }

    return CalificacionModel(
      idCalificacion: json['idCalificacion'] ?? 0,
      nota: (json['nota'] as num?)?.toDouble() ?? 0.0,
      descripcion: desc,
      cursoDescripcion: cursoDesc,
      nombreDocente: docente,
    );
  }
}
