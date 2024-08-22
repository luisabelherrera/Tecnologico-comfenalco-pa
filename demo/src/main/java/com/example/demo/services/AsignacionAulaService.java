package com.example.demo.services;


import com.example.demo.model.entities.AsignacionAula;

import java.util.List;
import java.util.Optional;

public interface AsignacionAulaService {
    AsignacionAula saveAsignacionAula(AsignacionAula asignacionAula);
    Optional<AsignacionAula> getAsignacionAulaById(Long id);
    List<AsignacionAula> getAllAsignacionesAulas();
    AsignacionAula updateAsignacionAula(AsignacionAula asignacionAula);
    void deleteAsignacionAula(Long id);
}