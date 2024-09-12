package com.security.springbootsecurityjwt.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class VerifyTokenController {

    @RequestMapping("/token")
    public String token() {
        return "Hola si funciona el token de acceso!";
    }

    @RequestMapping("/admin")
    public String admin() {
        return "Hola bienvenido Admin!";
    }

    @RequestMapping("/user")
    public String user() {
        return "Hola bienvenido User!";
    }
}
