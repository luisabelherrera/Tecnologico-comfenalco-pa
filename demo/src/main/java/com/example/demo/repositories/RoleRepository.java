package com.example.demo.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.login.Rol;

public interface RoleRepository extends JpaRepository<Rol, Long> {
    Optional<Rol> findByName(String name);
}
