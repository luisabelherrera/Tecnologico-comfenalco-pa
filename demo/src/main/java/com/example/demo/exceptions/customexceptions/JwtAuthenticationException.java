package com.example.demo.exceptions.customexceptions;

import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;

public class JwtAuthenticationException extends AuthenticationCredentialsNotFoundException {
    private static final long serialVersionUID = 1L;

    public JwtAuthenticationException(String message) {
        super(message);
    }
}
