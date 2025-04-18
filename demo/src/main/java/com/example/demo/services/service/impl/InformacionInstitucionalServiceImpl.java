package com.example.demo.services.service.impl;

import com.example.demo.model.entity.InformacionInstitucional;
import com.example.demo.repositories.mongo.InformacionInstitucionalRepository;
import com.example.demo.services.service.InformacionInstitucionalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InformacionInstitucionalServiceImpl implements InformacionInstitucionalService {

    private final InformacionInstitucionalRepository repository;

    @Override
    public Optional<InformacionInstitucional> findFirst() {
        List<InformacionInstitucional> all = repository.findAll();
        return all.isEmpty() ? Optional.empty() : Optional.of(all.get(0));
    }

    @Override
    public Optional<InformacionInstitucional> findById(String id) {
        return repository.findById(id);
    }

    @Override
    public InformacionInstitucional save(InformacionInstitucional info) {
        if (info.getNombreInstitucion() == null || info.getNombreInstitucion().isEmpty()) {
            throw new RuntimeException("El nombre de la institución no puede ser nulo o vacío.");
        }
        return repository.save(info);
    }
}