package com.example.demo.exceptions;

public class WebSocketAuthenticationException extends RuntimeException {
    public WebSocketAuthenticationException(String message) {
        super(message);
    }
}