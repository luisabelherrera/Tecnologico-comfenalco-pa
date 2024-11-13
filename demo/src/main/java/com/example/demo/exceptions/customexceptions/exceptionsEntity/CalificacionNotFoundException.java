package com.example.demo.exceptions.customexceptions.exceptionsEntity;

public class CalificacionNotFoundException extends RuntimeException {

    public CalificacionNotFoundException(Integer id) {
        super("Calificación no encontrada con ID: " + id);
    }
}
