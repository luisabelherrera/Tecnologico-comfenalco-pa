package com.example.demo.repositories.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.model.entity.DocenteNivelDetalleCurso;

@Repository
public interface DocenteNivelDetalleCursoRepository extends JpaRepository<DocenteNivelDetalleCurso, Integer> {
    // Puedes añadir métodos de consulta personalizados si es necesario
}