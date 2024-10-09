package com.example.demo.services.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.entity.NivelDetalle;

public interface NivelDetalleService {
    List<NivelDetalle> findAll();

    Optional<NivelDetalle> findById(Integer id);

    NivelDetalle save(NivelDetalle nivelDetalle);

    void deleteById(Integer id);
}
