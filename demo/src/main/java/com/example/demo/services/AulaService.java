package com.example.demo.services;


import com.example.demo.model.entities.Aula;

import java.util.List;
import java.util.Optional;

public interface AulaService {
    Aula saveAula(Aula aula);
    Optional<Aula> getAulaById(Long id);
    List<Aula> getAllAulas();
    Aula updateAula(Aula aula);
    void deleteAula(Long id);
}
