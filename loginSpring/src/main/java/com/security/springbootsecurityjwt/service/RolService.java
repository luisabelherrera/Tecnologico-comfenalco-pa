package com.security.springbootsecurityjwt.service;

import com.security.springbootsecurityjwt.model.Rol;

import java.util.Optional;

public interface RolService {

    public Optional<Rol> findByname(String name);
}
