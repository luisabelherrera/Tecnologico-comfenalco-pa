package com.example.demo.exceptions.messages;

public final class ErrorMessages {
    private ErrorMessages() {
        // Evita la instanciación
    }

    public static final String NOT_FOUND = "Recurso no encontrado.";
    public static final String CONFLICT = "Conflicto en la solicitud.";
    public static final String UNAUTHORIZED = "No autorizado.";
    public static final String DOCENTE_NULL = "Docente no puede ser nulo.";
    public static final String INSCRIPCION_ERROR = "Error en la inscripción.";
    public static final String NOTICIA_ERROR = "Error relacionado con la noticia.";
    public static final String NIVEL_DETALLE_CURSO_ERROR = "Error relacionado con el NivelDetalleCurso.";
    public static final String NIVEL_DETALLE_ERROR = "Error relacionado con el NivelDetalle.";
    public static final String HORARIO_ERROR = "Error relacionado con el Horario.";
    public static final String GRADO_SECCION_ERROR = "Error relacionado con el Grado y Sección.";
    public static final String FILE_UPLOAD_ERROR = "Error al cargar el archivo.";
    public static final String FILE_NOT_FOUND = "Archivo no encontrado.";
    public static final String ESTUDIANTE_NOT_FOUND = "Estudiante no encontrado con ID: ";
    public static final String ESTUDIANTE_CREACION_ERROR = "Error al crear el estudiante.";
    public static final String ESTUDIANTE_ACTUALIZACION_ERROR = "Error al actualizar el estudiante.";
    public static final String ESTUDIANTE_ELIMINACION_ERROR = "Error al eliminar el estudiante.";
    public static final String DOCENTE_NIVEL_DETALLE_CURSO_NOT_FOUND = "DocenteNivelDetalleCurso no encontrado con ID: ";
    public static final String CURSO_NOT_FOUND = "Curso no encontrado con ID: ";
    public static final String CURRICULAR_NOT_FOUND = "Curricular no encontrado con ID: ";
    public  static final String ACUDIENTE_NOT_FOUND = "Acudiente no encontrado con ID:";

}