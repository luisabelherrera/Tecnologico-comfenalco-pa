package com.example.demo.exceptions.customexceptions.exceptionsEntity;

public class CursoNotFoundException extends RuntimeException {

    public CursoNotFoundException(Integer id) {
        super("Curso no encontrado con ID: " + id);
    }
}
