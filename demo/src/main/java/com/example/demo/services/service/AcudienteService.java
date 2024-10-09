package com.example.demo.services.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.entity.Acudiente;

public interface AcudienteService {
    List<Acudiente> findAll();

    Optional<Acudiente> findById(Integer id);

    Acudiente save(Acudiente acudiente);

    void deleteById(Integer id);
}
