package com.example.demo.services.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.entity.GradoSeccion;

public interface GradoSeccionService {
    List<GradoSeccion> findAll();

    Optional<GradoSeccion> findById(Integer id);

    GradoSeccion save(GradoSeccion gradoSeccion);

    void deleteById(Integer id);
}
