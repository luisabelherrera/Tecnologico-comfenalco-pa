package com.example.demo.model.login.dto;

import java.util.Set;

import com.example.demo.model.login.Rol;

import lombok.Data;

@Data
public class RegisterDto {
    private Long id;
    private String username;
    private String email;
    private String password;
    private Set<Rol> roles;
    private Integer estudianteId;


}
