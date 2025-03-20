package com.example.demo.repositories.jpa;

import com.example.demo.model.entity.DesempenoEstudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DesempenoEstudianteRepository extends JpaRepository<DesempenoEstudiante, Integer> {
}