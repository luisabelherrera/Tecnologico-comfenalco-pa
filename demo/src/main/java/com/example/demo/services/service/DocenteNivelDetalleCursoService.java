package com.example.demo.services.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.entity.DocenteNivelDetalleCurso;

public interface DocenteNivelDetalleCursoService {
    List<DocenteNivelDetalleCurso> findAll();

    Optional<DocenteNivelDetalleCurso> findById(Integer id);

    DocenteNivelDetalleCurso save(DocenteNivelDetalleCurso docenteNivelDetalleCurso);

    void deleteById(Integer id);
}