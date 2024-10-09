package com.example.demo.services.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.entity.Docente;

public interface DocenteService {
    List<Docente> findAll();

    Optional<Docente> findById(Integer id);

    Docente save(Docente docente);

    void deleteById(Integer id);
}
