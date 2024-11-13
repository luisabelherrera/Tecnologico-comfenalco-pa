package com.example.demo.exceptions;

import com.example.demo.exceptions.customexceptions.*;
import com.example.demo.exceptions.customexceptions.exceptionsEntity.*;
import com.example.demo.exceptions.messages.ErrorMessages;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Date;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Manejador para NotFoundException
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorObject> handlerNotFoundException(NotFoundException ex) {
        ErrorObject errorObject = new ErrorObject(HttpStatus.NOT_FOUND.value(), ErrorMessages.NOT_FOUND, new Date());
        return new ResponseEntity<>(errorObject, HttpStatus.NOT_FOUND);
    }

    // Manejador para ConflictException
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ErrorObject> handlerConflictException(ConflictException ex) {
        ErrorObject errorObject = new ErrorObject(HttpStatus.CONFLICT.value(), ErrorMessages.CONFLICT, new Date());
        return new ResponseEntity<>(errorObject, HttpStatus.CONFLICT);
    }

    // Manejador para WebSocket
    @ExceptionHandler(WebSocketAuthenticationException.class)
    public ResponseEntity<ErrorObject> handleWebSocketAuthenticationException(WebSocketAuthenticationException ex) {
        ErrorObject errorObject = new ErrorObject(HttpStatus.UNAUTHORIZED.value(), ErrorMessages.UNAUTHORIZED, new Date());
        return new ResponseEntity<>(errorObject, HttpStatus.UNAUTHORIZED);
    }

    // Manejador para Jwt
    @ExceptionHandler(JwtAuthenticationException.class)
    public ResponseEntity<ErrorObject> handlerAuthenticationCredentialsNotFoundException(JwtAuthenticationException ex) {
        ErrorObject errorObject = new ErrorObject(HttpStatus.UNAUTHORIZED.value(), ErrorMessages.UNAUTHORIZED, new Date());
        return new ResponseEntity<>(errorObject, HttpStatus.UNAUTHORIZED);
    }

    // Manejador para DocenteNullException
    @ExceptionHandler(DocenteNullException.class)
    public ResponseEntity<ErrorObject> handleDocenteNullException(DocenteNullException ex) {
        ErrorObject errorObject = new ErrorObject(HttpStatus.BAD_REQUEST.value(), ErrorMessages.DOCENTE_NULL, new Date());
        return new ResponseEntity<>(errorObject, HttpStatus.BAD_REQUEST);
    }

    // Manejador para InscripcionException
    @ExceptionHandler(InscripcionException.class)
    public ResponseEntity<ErrorObject> handleInscripcionException(InscripcionException ex) {
        ErrorObject errorObject = new ErrorObject(HttpStatus.BAD_REQUEST.value(), ErrorMessages.INSCRIPCION_ERROR, new Date());
        return new ResponseEntity<>(errorObject, HttpStatus.BAD_REQUEST);
    }
    // Manejador para NivelDetalle
    @ExceptionHandler(NivelDetalleException.class)
    public ResponseEntity<ErrorObject> handleNivelDetalleException(NivelDetalleException ex) {
        ErrorObject errorObject = new ErrorObject(HttpStatus.BAD_REQUEST.value(), ErrorMessages.NIVEL_DETALLE_ERROR, new Date());
        return new ResponseEntity<>(errorObject, HttpStatus.BAD_REQUEST);
    }


    // Manejador para HorarioException
    @ExceptionHandler(HorarioException.class)
    public ResponseEntity<ErrorObject> handleHorarioException(HorarioException ex) {
        String message = ex.getMessage() != null ? ex.getMessage() : ErrorMessages.HORARIO_ERROR;
        ErrorObject error = new ErrorObject(HttpStatus.BAD_REQUEST.value(), message, new Date());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(GradoSeccionException.class)
    public ResponseEntity<ErrorObject> handleGradoSeccionException(GradoSeccionException ex) {
        // Utilizando el mensaje global desde ErrorMessages
        ErrorObject error = new ErrorObject(HttpStatus.BAD_REQUEST.value(), ErrorMessages.GRADO_SECCION_ERROR, new Date());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // Manejador global para File
    @ExceptionHandler(FileControllerException.class)
    public ResponseEntity<ErrorObject> handleFileControllerException(FileControllerException ex) {
        String errorMessage = ex.getMessage();
        HttpStatus status = HttpStatus.BAD_REQUEST;

        // Verifica si el mensaje contiene "Archivo no encontrado" y usa el mensaje adecuado
        if (errorMessage.contains(ErrorMessages.FILE_NOT_FOUND)) {
            status = HttpStatus.NOT_FOUND;
        } else if (errorMessage.contains(ErrorMessages.FILE_UPLOAD_ERROR)) {
            status = HttpStatus.BAD_REQUEST;
        }

        ErrorObject error = new ErrorObject(status.value(), errorMessage, new Date());
        return new ResponseEntity<>(error, status);
    }
    // Manejador global para Estudiante
    @ExceptionHandler(EstudianteException.class)
    public ResponseEntity<ErrorObject> handleEstudianteException(EstudianteException ex) {
        String errorMessage = ex.getMessage();
        HttpStatus status = HttpStatus.BAD_REQUEST;

        // Definir un estado diferente según el tipo de error
        if (errorMessage.contains("no encontrado")) {
            status = HttpStatus.NOT_FOUND;  // Estudiante no encontrado
        } else if (errorMessage.contains("inválido")) {
            status = HttpStatus.BAD_REQUEST;  // Error con datos inválidos
        }

        // Crear un objeto de error y devolverlo en la respuesta
        ErrorObject error = new ErrorObject(status.value(), errorMessage, new Date());
        return new ResponseEntity<>(error, status);
    }

    // Manejador para NoticiaException
    @ExceptionHandler(NoticiaException.class)
    public ResponseEntity<ErrorObject> handleNoticiaException(NoticiaException ex) {
        ErrorObject errorObject = new ErrorObject(HttpStatus.BAD_REQUEST.value(), ErrorMessages.NOTICIA_ERROR, new Date());
        return new ResponseEntity<>(errorObject, HttpStatus.BAD_REQUEST);
    }
    // Manejador para DocenteNivelDetalleCurso
    @ExceptionHandler(DocenteNivelDetalleCursoException.class)
    public ResponseEntity<String> handleDocenteNivelDetalleCursoException(DocenteNivelDetalleCursoException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    // Manejador para Curricular
    @ExceptionHandler(CurricularNotFoundException.class)
    public ResponseEntity<String> handleCurricularNotFoundException(CurricularNotFoundException ex) {
        return new ResponseEntity<>(ErrorMessages.CURRICULAR_NOT_FOUND + ex.getMessage(), HttpStatus.NOT_FOUND);
    }


    // Manejador para Curricular
    @ExceptionHandler(AcudienteNotFoundException.class)
    public ResponseEntity<String> AcudienteNotFoundException(AcudienteNotFoundException ex) {
        return new ResponseEntity<>(ErrorMessages.ACUDIENTE_NOT_FOUND + ex.getMessage(), HttpStatus.NOT_FOUND);
    }




    // Manejador para Curso
    @ExceptionHandler(CursoNotFoundException.class)
    public ResponseEntity<String> handleCursoNotFoundException(CursoNotFoundException ex) {
        // Usamos el mensaje global de ErrorMessages
        return new ResponseEntity<>(ErrorMessages.CURSO_NOT_FOUND + ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(NivelDetalleCursoException.class)
    public ResponseEntity<ErrorObject> handleNivelDetalleCursoException(NivelDetalleCursoException ex) {
        ErrorObject errorObject = new ErrorObject(HttpStatus.BAD_REQUEST.value(), ErrorMessages.NIVEL_DETALLE_CURSO_ERROR, new Date());
        return new ResponseEntity<>(errorObject, HttpStatus.BAD_REQUEST);
    }

    // Manejador para excepciones generales
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorObject> handleGeneralException(Exception ex) {
        ErrorObject errorObject = new ErrorObject(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Ha ocurrido un error: " + ex.getMessage(), new Date());
        return new ResponseEntity<>(errorObject, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
