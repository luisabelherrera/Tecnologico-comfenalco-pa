package com.example.demo.repositories.jpa;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.Horario;

@Repository
public interface HorarioRepository extends JpaRepository<Horario, Integer> {
    @Query("SELECT h FROM Horario h " +
    "WHERE h.nivelDetalleCurso.docenteNivelDetalleCurso.docente.idDocente = :idDocente")
List<Horario> findByNivelDetalleCursoDocenteIdDocente(Integer idDocente);
}