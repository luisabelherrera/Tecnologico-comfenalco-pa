package com.example.demo.services.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.entity.Calificacion;

public interface CalificacionService {
    List<Calificacion> findAll();

    Optional<Calificacion> findById(Integer id);
    List<Calificacion> findByDocenteId(Integer idDocente);
    Calificacion save(Calificacion calificacion);
    List<Calificacion> findByCurricularId(Integer idCurricular);
    void deleteById(Integer id);
}
