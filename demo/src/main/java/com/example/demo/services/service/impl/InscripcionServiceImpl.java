package com.example.demo.services.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired; // Cambia el nombre aquí
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.Inscripcion; // Cambia el nombre aquí
import com.example.demo.repositories.repository.InscripcionRepository;
import com.example.demo.services.service.InscripcionService;

@Service
public class InscripcionServiceImpl implements InscripcionService { // Cambia el nombre aquí

    @Autowired
    private InscripcionRepository inscripcionRepository; // Cambia el nombre aquí

    @Override
    public List<Inscripcion> findAll() { // Cambia el nombre aquí
        return inscripcionRepository.findAll(); // Cambia el nombre aquí
    }

    @Override
    public Optional<Inscripcion> findById(Integer id) { // Cambia el nombre aquí
        return inscripcionRepository.findById(id); // Cambia el nombre aquí
    }

    @Override
    public Inscripcion save(Inscripcion inscripcion) { // Cambia el nombre aquí
        return inscripcionRepository.save(inscripcion); // Cambia el nombre aquí
    }

    @Override
    public void deleteById(Integer id) { // Cambia el nombre aquí
        inscripcionRepository.deleteById(id); // Cambia el nombre aquí
    }
}
