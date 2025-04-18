package com.example.demo.services.service;

import com.example.demo.model.entity.InformacionInstitucional;
import java.util.Optional;

public interface InformacionInstitucionalService {
    Optional<InformacionInstitucional> findFirst();
    Optional<InformacionInstitucional> findById(String id);
    InformacionInstitucional save(InformacionInstitucional info);
}