package com.example.demo.repositories.jpa;

import com.example.demo.model.entity.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AsistenciaRepository extends JpaRepository<Asistencia, Integer> {
    List<Asistencia> findByNivelDetalleCursoIdNivelDetalleCurso(Integer idNivelDetalleCurso);

    // Cambiar a List para manejar múltiples resultados
    List<Asistencia> findByEstudianteIdEstudianteAndFechaAndNivelDetalleCursoIdNivelDetalleCurso(
        Integer idEstudiante, LocalDate fecha, Integer idNivelDetalleCurso);
}