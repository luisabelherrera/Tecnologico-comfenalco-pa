package com.example.demo.services.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.entity.Inscripcion; // Cambia el nombre aquí

public interface InscripcionService { // Cambia el nombre aquí
    List<Inscripcion> findAll(); // Cambia el nombre aquí

    Optional<Inscripcion> findById(Integer id); // Cambia el nombre aquí

    Inscripcion save(Inscripcion inscripcion); // Cambia el nombre aquí

    void deleteById(Integer id); // Cambia el nombre aquí
}
