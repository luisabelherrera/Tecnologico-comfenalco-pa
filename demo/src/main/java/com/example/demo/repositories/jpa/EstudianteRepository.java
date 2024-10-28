package com.example.demo.repositories.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.Estudiante;

@Repository
public interface EstudianteRepository extends JpaRepository<Estudiante, Integer> {
}
