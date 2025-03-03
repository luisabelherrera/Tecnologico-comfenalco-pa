package com.example.demo.repositories.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.Curricular;

@Repository
public interface CurricularRepository extends JpaRepository<Curricular, Integer> {
    List<Curricular> findByDocenteNivelDetalleCursoDocenteIdDocente(Integer idDocente);
}