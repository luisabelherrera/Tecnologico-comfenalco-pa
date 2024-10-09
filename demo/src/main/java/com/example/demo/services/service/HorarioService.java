package com.example.demo.services.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.entity.Horario;

public interface HorarioService {
    List<Horario> findAll();

    Optional<Horario> findById(Integer id);

    Horario save(Horario horario);

    void deleteById(Integer id);
}
