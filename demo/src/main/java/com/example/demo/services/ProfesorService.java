package com.example.demo.services;


import com.example.demo.model.entities.Profesor;
import java.util.List;
import java.util.Optional;

public interface ProfesorService {
    Profesor saveProfesor(Profesor profesor);
    Optional<Profesor> getProfesorById(Long id);
    List<Profesor> getAllProfesores();
    Profesor updateProfesor(Profesor profesor);
    void deleteProfesor(Long id);
}