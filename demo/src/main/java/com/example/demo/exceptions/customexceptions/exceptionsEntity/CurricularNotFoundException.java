package com.example.demo.exceptions.customexceptions.exceptionsEntity;

public class CurricularNotFoundException extends RuntimeException {

    public CurricularNotFoundException(Integer id) {
        super("Curricular no encontrado con ID: " + id);
    }
}