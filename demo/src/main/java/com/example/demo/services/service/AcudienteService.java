package com.example.demo.services.service;

import java.util.List;
import java.util.Optional;
import com.example.demo.model.entity.dto.AcudienteDTO;


public interface AcudienteService {

    List<AcudienteDTO> findAll();

    Optional<AcudienteDTO> findById(long id);

    AcudienteDTO save(AcudienteDTO acudienteDTO);

    void deleteById(long id);
}