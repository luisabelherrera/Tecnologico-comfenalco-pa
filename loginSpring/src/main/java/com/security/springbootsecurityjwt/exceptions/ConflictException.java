package com.security.springbootsecurityjwt.exceptions;

public class ConflictException extends RuntimeException{

    private static final long serialVersionUID = 1;

    public ConflictException(String message){
        super(message);
    }
}
