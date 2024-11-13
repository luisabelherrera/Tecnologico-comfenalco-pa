package com.example.demo.exceptions.customexceptions.exceptionsEntity;

public class AcudienteNotFoundException extends RuntimeException {

    public AcudienteNotFoundException(Integer id) {
        super("Acudiente no encontrado con ID: " + id);
    }
}