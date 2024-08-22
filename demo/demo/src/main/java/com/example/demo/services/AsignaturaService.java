package com.example.demo.services;

import com.example.demo.model.entities.Asignatura;

import java.util.Optional;

public interface AsignaturaService {
    Iterable<Asignatura> listar();
    Optional<Asignatura> obtenerPorId(Long id);
    Asignatura crear(Asignatura asignatura);
    Asignatura actualizar(Long id, Asignatura asignaturaDetalles);
    void eliminar(Long id);
    Optional<Asignatura> obtenerPorCodigo(String codigo);  // Nuevo método para buscar por código
}
