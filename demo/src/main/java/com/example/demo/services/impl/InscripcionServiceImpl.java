package com.example.demo.services.impl;

import com.example.demo.model.entities.Inscripcion;
import com.example.demo.repositories.InscripcionRepository;
import com.example.demo.services.InscripcionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class InscripcionServiceImpl implements InscripcionService {

    private final InscripcionRepository inscripcionRepository;

    @Autowired
    public InscripcionServiceImpl(InscripcionRepository inscripcionRepository) {
        this.inscripcionRepository = inscripcionRepository;
    }

    @Override
    public Inscripcion saveInscripcion(Inscripcion inscripcion) {
        return inscripcionRepository.save(inscripcion);
    }

    @Override
    public Optional<Inscripcion> getInscripcionById(Long id) {
        return inscripcionRepository.findById(id);
    }

    @Override
    public List<Inscripcion> getAllInscripciones() {
        return inscripcionRepository.findAll();
    }

    @Override
    public Inscripcion updateInscripcion(Inscripcion inscripcion) {
        return inscripcionRepository.save(inscripcion);
    }

    @Override
    public void deleteInscripcion(Long id) {
        inscripcionRepository.deleteById(id);
    }
}