package com.example.demo.services;

import com.example.demo.model.entities.Periodo;

import java.util.Optional;

public interface PeriodoService {
    Iterable<Periodo> listar();
    Optional<Periodo> obtenerPorId(Long id);
    Periodo crear(Periodo periodo);
    Periodo actualizar(Long id, Periodo periodoDetalles);
    void eliminar(Long id);
}