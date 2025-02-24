package com.example.demo.repositories.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.Calificacion;
import com.example.demo.model.entity.Estudiante;

@Repository
public interface CalificacionRepository extends JpaRepository<Calificacion, Integer> {
    List<Calificacion> findByEstudianteAndActivoTrue(Estudiante estudiante);
}
