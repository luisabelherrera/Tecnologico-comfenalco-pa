package com.example.demo.services;

import java.util.Optional;

import com.example.demo.model.login.Rol;

public interface RolService {

    public Optional<Rol> findByname(String name);
}
