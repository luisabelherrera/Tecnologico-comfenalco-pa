package com.example.demo.repositories.jpa;

import com.example.demo.model.entity.EncuestaEstudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EncuestaEstudianteRepository extends JpaRepository<EncuestaEstudiante, Long> {

    // Encuesta por id del estudiante (única por estudiante)
    Optional<EncuestaEstudiante> findByEstudianteIdEstudiante(Integer idEstudiante);

    boolean existsByEstudianteIdEstudiante(Integer idEstudiante);
}