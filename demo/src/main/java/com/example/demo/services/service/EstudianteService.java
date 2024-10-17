package com.example.demo.services.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.entity.dto.EstudianteDTO;

public interface EstudianteService {
    List<EstudianteDTO> findAll();

    Optional<EstudianteDTO> findById(Integer id);

    EstudianteDTO save(EstudianteDTO estudianteDTO);

    void deleteById(Integer id);
}