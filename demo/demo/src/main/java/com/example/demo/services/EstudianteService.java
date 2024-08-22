package com.example.demo.services;

import com.example.demo.model.entities.Estudiante;


import java.util.Optional;


public interface EstudianteService {
    Iterable<Estudiante> listar();
    Optional<Estudiante> obtenerPorId(Long id);
    Estudiante crear(Estudiante estudiante);
    Estudiante actualizar(Long id, Estudiante estudianteDetalles);
    void eliminar(Long id);


}