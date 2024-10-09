package com.example.demo.services.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.entity.Nivel;

public interface NivelService {
    List<Nivel> findAll();

    Optional<Nivel> findById(Integer id);

    Nivel save(Nivel nivel);

    void deleteById(Integer id);
}
