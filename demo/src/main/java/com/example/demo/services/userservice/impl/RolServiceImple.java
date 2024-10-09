package com.example.demo.services.userservice.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.exceptions.ConflictException;
import com.example.demo.model.login.Rol;
import com.example.demo.repositories.RoleRepository;
import com.example.demo.services.userservice.RolService;

@Service
public class RolServiceImple implements RolService {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public Optional<Rol> findByname(String name) {
        return roleRepository.findByName(name);
    }

    @Override
    public List<Rol> findAll() {
        return roleRepository.findAll();
    }

    @Override
    public Rol save(Rol rol) {
        if (roleRepository.findByName(rol.getName()).isPresent()) {
            throw new ConflictException("El rol ya existe!");
        }
        return roleRepository.save(rol);
    }
}
