package com.example.demo.services.userservice;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.login.Rol;

public interface RolService {
    Optional<Rol> findByname(String name);

    List<Rol> findAll();

    Rol save(Rol rol);
}
