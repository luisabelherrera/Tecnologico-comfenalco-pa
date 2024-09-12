package com.example.demo.Exception;

public class DepartamentoInUseException extends RuntimeException {
    public DepartamentoInUseException(String message) {
        super(message);
    }
}