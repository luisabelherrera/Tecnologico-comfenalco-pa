package com.example.demo.services.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.entity.Periodo;

public interface PeriodoService {
    List<Periodo> findAll();

    Optional<Periodo> findById(Integer id);

    Periodo save(Periodo periodo);

    void deleteById(Integer id);
}
