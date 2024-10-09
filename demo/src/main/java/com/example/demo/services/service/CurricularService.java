package com.example.demo.services.service;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.entity.Curricular;

public interface CurricularService {
    List<Curricular> findAll();

    Optional<Curricular> findById(Integer id);

    Curricular save(Curricular curricular);

    void deleteById(Integer id);
}
