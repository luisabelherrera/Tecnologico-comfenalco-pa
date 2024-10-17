package com.example.demo.services.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.Nivel;
import com.example.demo.model.entity.Periodo;
import com.example.demo.repositories.repository.NivelRepository;
import com.example.demo.services.service.NivelService;
import com.example.demo.services.service.PeriodoService;

@Service
public class NivelServiceImpl implements NivelService {

    @Autowired
    private NivelRepository nivelRepository;

    @Autowired
    private PeriodoService periodoService;

    @Override
    public List<Nivel> findAll() {
        return nivelRepository.findAll();
    }

    @Override
    public Optional<Nivel> findById(Integer id) {
        return nivelRepository.findById(id);
    }

    @Override
    public Nivel save(Nivel nivel) {
        try {
            if (nivel.getPeriodo() != null) {
               Optional<Periodo> periodoExistente = periodoService.findById(nivel.getPeriodo().getIdPeriodo());

                if (!periodoExistente.isPresent()) {
                    Periodo periodoGuardado = periodoService.save(nivel.getPeriodo());
                    nivel.setPeriodo(periodoGuardado);
                } else {
                    nivel.setPeriodo(periodoExistente.get());
                }
            }

          return nivelRepository.save(nivel);
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar el nivel: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteById(Integer id) {
        nivelRepository.deleteById(id);
    }
}
