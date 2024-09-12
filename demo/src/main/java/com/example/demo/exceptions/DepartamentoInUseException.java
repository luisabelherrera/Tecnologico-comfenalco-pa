package com.example.demo.exceptions;

public class DepartamentoInUseException extends RuntimeException {
    public DepartamentoInUseException(String message) {
        super(message);
    }
}