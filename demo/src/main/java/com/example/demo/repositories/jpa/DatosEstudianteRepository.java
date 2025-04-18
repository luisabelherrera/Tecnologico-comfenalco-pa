package com.example.demo.repositories.jpa;

import com.example.demo.model.entity.DatosEstudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DatosEstudianteRepository extends JpaRepository<DatosEstudiante, Long> {
    Optional<DatosEstudiante> findByDocumento(long documento); // Cambiado de String a long
}