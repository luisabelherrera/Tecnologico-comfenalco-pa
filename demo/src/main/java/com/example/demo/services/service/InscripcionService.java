package com.example.demo.services.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.entity.Inscripcion; // Cambia el nombre aquí

public interface InscripcionService {
    List<Inscripcion> findAll();

    Optional<Inscripcion> findById(Integer id);

    Inscripcion save(Inscripcion inscripcion);

    void deleteById(Integer id);
}
