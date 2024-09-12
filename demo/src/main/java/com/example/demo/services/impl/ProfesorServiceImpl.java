package com.example.demo.services.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.demo.model.entities.Profesor;
import com.example.demo.repositories.ProfesorRepository;
import com.example.demo.services.ProfesorService;

@Service
public class ProfesorServiceImpl implements ProfesorService {

    private final ProfesorRepository profesorRepository;

    public ProfesorServiceImpl(ProfesorRepository profesorRepository) {
        this.profesorRepository = profesorRepository;
    }

    @Override
    public Profesor saveProfesor(Profesor profesor) {
        return profesorRepository.save(profesor);
    }

    @Override
    public Optional<Profesor> getProfesorById(Long id) {
        return profesorRepository.findById(id);
    }

    @Override
    public List<Profesor> getAllProfesores() {
        return profesorRepository.findAll();
    }

    @Override
    public Profesor updateProfesor(Profesor profesor) {
        return profesorRepository.save(profesor);
    }

    @Override
    public void deleteProfesor(Long id) {
        profesorRepository.deleteById(id);
    }
}
