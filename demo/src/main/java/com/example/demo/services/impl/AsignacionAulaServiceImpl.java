package com.example.demo.services.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.demo.model.entities.AsignacionAula;
import com.example.demo.repositories.AsignacionAulaRepository;
import com.example.demo.services.AsignacionAulaService;

@Service
public class AsignacionAulaServiceImpl implements AsignacionAulaService {

    private final AsignacionAulaRepository asignacionAulaRepository;

    public AsignacionAulaServiceImpl(AsignacionAulaRepository asignacionAulaRepository) {
        this.asignacionAulaRepository = asignacionAulaRepository;
    }

    @Override
    public AsignacionAula saveAsignacionAula(AsignacionAula asignacionAula) {
        return asignacionAulaRepository.save(asignacionAula);
    }

    @Override
    public Optional<AsignacionAula> getAsignacionAulaById(Long id) {
        return asignacionAulaRepository.findById(id);
    }

    @Override
    public List<AsignacionAula> getAllAsignacionesAulas() {
        return asignacionAulaRepository.findAll();
    }

    @Override
    public AsignacionAula updateAsignacionAula(AsignacionAula asignacionAula) {
        return asignacionAulaRepository.save(asignacionAula);
    }

    @Override
    public void deleteAsignacionAula(Long id) {
        asignacionAulaRepository.deleteById(id);
    }
}
