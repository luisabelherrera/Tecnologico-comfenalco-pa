package com.example.demo.services.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.entity.Estudiante;

public interface EstudianteService {
    List<Estudiante> findAll();

    Optional<Estudiante> findById(Integer id);

    Estudiante save(Estudiante estudiante);

    void deleteById(Integer id);
}
