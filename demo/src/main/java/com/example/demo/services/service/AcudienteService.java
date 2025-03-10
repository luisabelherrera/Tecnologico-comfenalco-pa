package com.example.demo.services.service;

import com.example.demo.model.entity.dto.AcudienteDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface AcudienteService {
    Page<AcudienteDTO> findByFilters(String nombres, String documentoIdentidad, String parentesco, String ciudad, Boolean activo, Pageable pageable);

    Page<AcudienteDTO> findAll(Pageable pageable);

    Optional<AcudienteDTO> findById(long id);

    AcudienteDTO save(AcudienteDTO acudienteDTO);

    void deleteById(long id);
}