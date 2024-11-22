package com.example.demo.jwt;

public class SecurityConstants {



    // tiempo de token
    //30 minutos: 1800000 milisegundos
    //1 hora: 3600000 milisegundos
    //2 horas: 7200000 milisegundos
    //1 día (24 horas): 86400000 milisegundos
    public static final long JWT_EXPIRATION = 86400000; // aproximadamento 15 minutos
}
