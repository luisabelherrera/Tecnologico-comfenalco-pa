package com.example.demo.services.impl;

import com.example.demo.model.entities.Periodo;
import com.example.demo.repositories.PeriodoRepository;
import com.example.demo.services.PeriodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class PeriodoServiceImpl implements PeriodoService {

    private final PeriodoRepository periodoRepository;

    @Autowired
    public PeriodoServiceImpl(PeriodoRepository periodoRepository) {
        this.periodoRepository = periodoRepository;
    }

    @Override
    public Iterable<Periodo> listar() {
        return periodoRepository.findAll();
    }

    @Override
    public Optional<Periodo> obtenerPorId(Long id) {
        return periodoRepository.findById(id);
    }

    @Override
    public Periodo crear(Periodo periodo) {
        return periodoRepository.save(periodo);
    }

    @Override
    public Periodo actualizar(Long id, Periodo periodoDetalles) {
        Optional<Periodo> periodoOptional = periodoRepository.findById(id);
        if (periodoOptional.isPresent()) {
            Periodo periodoExistente = periodoOptional.get();
            periodoExistente.setNombre(periodoDetalles.getNombre());
            periodoExistente.setFechaInicio(periodoDetalles.getFechaInicio());
            periodoExistente.setFechaFin(periodoDetalles.getFechaFin());
            return periodoRepository.save(periodoExistente);
        } else {
            throw new IllegalArgumentException("Periodo con ID " + id + " no existe.");
        }
    }

    @Override
    public void eliminar(Long id) {
        periodoRepository.deleteById(id);
    }
}