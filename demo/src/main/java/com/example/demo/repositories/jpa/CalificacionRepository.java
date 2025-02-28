package com.example.demo.repositories.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.Calificacion;
import com.example.demo.model.entity.Estudiante;

@Repository
public interface CalificacionRepository extends JpaRepository<Calificacion, Integer> {
    List<Calificacion> findByEstudianteAndActivoTrue(Estudiante estudiante);

    @Query("SELECT c FROM Calificacion c " +
           "WHERE c.curricular.docenteNivelDetalleCurso.docente.idDocente = :idDocente")
    List<Calificacion> findByCurricularDocenteNivelDetalleCursoDocenteIdDocente(Integer idDocente);
}