package com.example.demo.exceptions.customexceptions.exceptionsEntity;

public class GradoSeccionException extends RuntimeException {

    public GradoSeccionException(String message) {
        super(message);
    }

    public GradoSeccionException(String message, Throwable cause) {
        super(message, cause);
    }
}