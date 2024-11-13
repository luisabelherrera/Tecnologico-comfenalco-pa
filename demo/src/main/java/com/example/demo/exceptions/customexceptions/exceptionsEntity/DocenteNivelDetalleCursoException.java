package com.example.demo.exceptions.customexceptions.exceptionsEntity;

public class DocenteNivelDetalleCursoException extends RuntimeException {

    public DocenteNivelDetalleCursoException(String message) {
        super(message);
    }

    public DocenteNivelDetalleCursoException(String message, Throwable cause) {
        super(message, cause);
    }
}
