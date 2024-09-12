package com.example.demo.services;

import com.example.demo.model.entities.Curso;

import java.util.List;
import java.util.Optional;


public interface CursoService {

    Curso saveCurso(Curso curso);
    Optional<Curso> getCursoById(Long id);
    List<Curso> getAllCursos();
    Curso updateCurso(Curso curso);
    void deleteCurso(Long id);
}