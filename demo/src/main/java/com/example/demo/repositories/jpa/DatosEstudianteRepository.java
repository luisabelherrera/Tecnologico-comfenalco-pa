package com.example.demo.repositories.jpa;

import com.example.demo.model.entity.DatosEstudiante;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DatosEstudianteRepository extends JpaRepository<DatosEstudiante, Long> {
}