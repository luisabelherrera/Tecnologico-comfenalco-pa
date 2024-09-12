package com.example.demo.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import com.example.demo.model.login.Rol;

@Repository
public interface RoleRepository extends JpaRepository<Rol, Long> {

    Optional<Rol> findByName(String name);
}
