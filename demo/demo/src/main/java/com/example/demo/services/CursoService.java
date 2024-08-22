package com.example.demo.services;

import com.example.demo.model.entities.Curso;

import java.util.Optional;


public interface CursoService {

    Iterable<Curso> listar();
    Curso crear(Curso curso);
    Curso actualizar(Long id, Curso cursoDetalles);
    void eliminar(Long id);
    Optional<Curso> obtenerPorId(Long id);
}