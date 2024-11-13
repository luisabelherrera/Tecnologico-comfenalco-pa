package com.example.demo.exceptions.customexceptions.exceptionsEntity;

public class HorarioException extends RuntimeException {

    public HorarioException(String message) {
        super(message);
    }

    public HorarioException(String message, Throwable cause) {
        super(message, cause);
    }
}
