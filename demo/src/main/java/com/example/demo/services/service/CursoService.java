package com.example.demo.services.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.entity.Curso;

public interface CursoService {
    List<Curso> findAll();

    Optional<Curso> findById(Integer id);

    Curso save(Curso curso);

    void deleteById(Integer id);
}
