class Noticia {
  final String id;
  final String titulo;
  final String contenido;
  final String? imagenPath;
  final String? videoPath;
  final DateTime? fechaPublicacion;

  Noticia({
    required this.id,
    required this.titulo,
    required this.contenido,
    this.imagenPath,
    this.videoPath,
    this.fechaPublicacion,
  });

  factory Noticia.fromJson(Map<String, dynamic> json) {
    DateTime? fecha;
    final rawFecha = json['fechaPublicacion'] ?? json['fecha'] ?? json['createdAt'];
    if (rawFecha != null) {
      try {
        fecha = DateTime.parse(rawFecha.toString());
      } catch (_) {}
    }

    return Noticia(
      id: json['id'] ?? json['_id'] ?? '',
      titulo: json['titulo'] ?? '',
      contenido: json['contenido'] ?? '',
      imagenPath: json['imagenPath'],
      videoPath: json['videoPath'],
      fechaPublicacion: fecha,
    );
  }
}
