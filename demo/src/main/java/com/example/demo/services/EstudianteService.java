package com.example.demo.services;


import com.example.demo.model.entities.Estudiante;

import java.util.List;
import java.util.Optional;


public interface EstudianteService{
    Estudiante saveEstudiante(Estudiante estudiante);
    Optional<Estudiante> getEstudianteById(Long id);
    List<Estudiante> getAllEstudiantes();
    Estudiante updateEstudiante(Estudiante estudiante);
    void deleteEstudiante(Long id);
}