package com.example.demo.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.login.Rol;
import com.example.demo.repositories.RoleRepository;
import com.example.demo.services.RolService;

import java.util.Optional;

@Service
public class RolServiceImple implements RolService {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public Optional<Rol> findByname(String name) {
        return roleRepository.findByName(name);
    }
}
