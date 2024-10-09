package com.example.demo.services.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.entity.NivelDetalleCurso;

public interface NivelDetalleCursoService {
    List<NivelDetalleCurso> findAll();

    Optional<NivelDetalleCurso> findById(Integer id);

    NivelDetalleCurso save(NivelDetalleCurso nivelDetalleCurso);

    void deleteById(Integer id);
}
