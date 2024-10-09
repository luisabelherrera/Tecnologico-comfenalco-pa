package com.example.demo.services.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.entity.Calificacion;

public interface CalificacionService {
    List<Calificacion> findAll();

    Optional<Calificacion> findById(Integer id);

    Calificacion save(Calificacion calificacion);

    void deleteById(Integer id);
}
