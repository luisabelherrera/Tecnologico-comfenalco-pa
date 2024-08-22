package com.example.demo.services;



import com.example.demo.model.entities.Profesor;

import java.util.List;
import java.util.Optional;

public interface ProfesorService {

    Iterable<Profesor> listar();
    Profesor crear(Profesor profesor);
    Optional<Profesor> obtenerPorId(Long id);
    Profesor actualizar(Long id, Profesor profesorDetalles);
    void eliminar(Long id);
    List<Profesor> filtrarPorNombre(String nombreCompleto);
}