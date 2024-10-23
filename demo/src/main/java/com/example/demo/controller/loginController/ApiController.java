package com.example.demo.controller.loginController;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin
@RestController
@RequestMapping("/api")
public class ApiController {

    @GetMapping("/data")
    public String getData() {
        return "Este es un dato protegido";
    }
}
