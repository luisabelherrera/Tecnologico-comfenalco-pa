package com.example.demo.services;

import com.example.demo.model.entities.Matricula;

import java.util.Optional;

public interface MatriculaService {

    Matricula crear(Matricula matricula);
   Iterable<Matricula> listar();
   Optional<Matricula> obtenerPorId(Long id);
    Matricula actualizar(Long id, Matricula matriculaDetalles);
       void eliminarPorId(Long id);
}