package com.example.demo.services;


import com.example.demo.model.entities.Inscripcion;


import java.util.List;
import java.util.Optional;


public interface InscripcionService {
    Inscripcion saveInscripcion(Inscripcion inscripcion);
    Optional<Inscripcion> getInscripcionById(Long id);
    List<Inscripcion> getAllInscripciones();
    Inscripcion updateInscripcion(Inscripcion inscripcion);
    void deleteInscripcion(Long id);
}