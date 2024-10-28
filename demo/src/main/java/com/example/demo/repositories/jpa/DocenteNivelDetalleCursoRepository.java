package com.example.demo.repositories.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.model.entity.DocenteNivelDetalleCurso;

@Repository
public interface DocenteNivelDetalleCursoRepository extends JpaRepository<DocenteNivelDetalleCurso, Integer> {

}