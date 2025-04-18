package com.example.demo.services.service;

import com.example.demo.model.entity.EncuestaEstudiante;

import java.util.Optional;
import java.util.List;

public interface EncuestaEstudianteService {

    EncuestaEstudiante guardarEncuesta(EncuestaEstudiante encuesta);

    Optional<EncuestaEstudiante> obtenerPorId(Long id);

    Optional<EncuestaEstudiante> obtenerPorEstudianteId(Integer estudianteId);

    List<EncuestaEstudiante> listarTodas();

    EncuestaEstudiante actualizarEncuesta(Long id, EncuestaEstudiante encuestaActualizada);

    void eliminarEncuesta(Long id);
}