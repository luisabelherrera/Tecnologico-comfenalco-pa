package com.example.demo.repositories.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.Estudiante;
import com.example.demo.model.login.UserEntity;

@Repository
public interface EstudianteRepository extends JpaRepository<Estudiante, Integer> {
    Optional<Estudiante> findByUser(UserEntity user);
    Optional<Estudiante> findByDocumentoIdentidad(String documentoIdentidad);

}
