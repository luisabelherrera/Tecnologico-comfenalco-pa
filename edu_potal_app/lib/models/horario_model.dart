class HorarioModel {
  final int idHorario;
  final String diaSemana;
  final String horaInicio;
  final String horaFin;
  final String cursoDescripcion;
  final String profesorNombre;

  HorarioModel({
    required this.idHorario,
    required this.diaSemana,
    required this.horaInicio,
    required this.horaFin,
    required this.cursoDescripcion,
    required this.profesorNombre,
  });

  factory HorarioModel.fromJson(Map<String, dynamic> json) {
    String cursoDesc = 'Sin Curso Asignado';
    String proNombre = 'Sin Docente'; 
    
    if (json['nivelDetalleCurso'] != null) {
      try {
             // Depending on the backend model, sometimes it might be just un nivel detalle curso 
        cursoDesc = json['nivelDetalleCurso']['curso']['descripcion'] ?? cursoDesc;
      } catch (e) {
        print("Mapeo de curso en horario fallo: \$e");
      }
    }
    
    return HorarioModel(
      idHorario: json['idHorario'] ?? 0,
      diaSemana: json['diaSemana'] ?? 'Sin Día',
      horaInicio: json['horaInicio'] ?? '--:--',
      horaFin: json['horaFin'] ?? '--:--',
      cursoDescripcion: cursoDesc,
      profesorNombre: proNombre,
    );
  }
}
