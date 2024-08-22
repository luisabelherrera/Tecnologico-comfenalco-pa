package com.example.demo.services;

import com.example.demo.model.entities.Calificacion;


import java.util.Optional;


public interface CalificacionService {

    Iterable<Calificacion> listar();
    Optional<Calificacion> buscarPorId(Long id);
    Calificacion guardar(Calificacion calificacion);
    void eliminar(Long id);
    void actualizar(Calificacion calificacion);
}
