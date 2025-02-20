package com.example.demo.services.service;

import com.example.demo.model.entity.Calificacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import com.example.demo.model.entity.dto.AcudienteDTO;

public interface AcudienteService {
    Page<AcudienteDTO> findByFilters(String nombres, String documentoIdentidad, Pageable pageable);

    Page<AcudienteDTO> findAll(Pageable pageable);
    Optional<AcudienteDTO> findById(long id);

    AcudienteDTO save(AcudienteDTO acudienteDTO);

    void deleteById(long id);
}
