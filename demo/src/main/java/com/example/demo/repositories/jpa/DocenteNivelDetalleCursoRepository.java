package com.example.demo.repositories.jpa;

import com.example.demo.model.entity.DocenteNivelDetalleCurso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocenteNivelDetalleCursoRepository extends JpaRepository<DocenteNivelDetalleCurso, Integer> {
    // Método para encontrar cursos asignados por ID del docente
    List<DocenteNivelDetalleCurso> findByDocenteIdDocente(Integer idDocente);

    // Verificar si existe una asignación de curso para el docente
    @Query("SELECT COUNT(d) > 0 FROM DocenteNivelDetalleCurso d " +
           "WHERE d.nivelDetalleCurso.idNivelDetalleCurso = :idCurso " +
           "AND d.docente.idDocente = :idDocente")
    boolean existsByNivelDetalleCursoIdNivelDetalleCursoAndDocenteIdDocente(Integer idCurso, Integer idDocente);

    // Obtener la asignación específica de curso y docente
    @Query("SELECT d FROM DocenteNivelDetalleCurso d " +
           "WHERE d.nivelDetalleCurso.idNivelDetalleCurso = :idCurso " +
           "AND d.docente.idDocente = :idDocente")
    Optional<DocenteNivelDetalleCurso> findByNivelDetalleCursoIdNivelDetalleCursoAndDocenteIdDocente(
            Integer idCurso, Integer idDocente);
}