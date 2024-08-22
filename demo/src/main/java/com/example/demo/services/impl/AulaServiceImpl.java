package com.example.demo.services.impl;

import com.example.demo.model.entities.Aula;
import com.example.demo.repositories.AulaRepository;
import com.example.demo.services.AulaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AulaServiceImpl implements AulaService {

    private final AulaRepository aulaRepository;

    @Autowired
    public AulaServiceImpl(AulaRepository aulaRepository) {
        this.aulaRepository = aulaRepository;
    }

    @Override
    public Aula saveAula(Aula aula) {
        return aulaRepository.save(aula);
    }

    @Override
    public Optional<Aula> getAulaById(Long id) {
        return aulaRepository.findById(id);
    }

    @Override
    public List<Aula> getAllAulas() {
        return aulaRepository.findAll();
    }

    @Override
    public Aula updateAula(Aula aula) {
        return aulaRepository.save(aula);
    }

    @Override
    public void deleteAula(Long id) {
        try {
            aulaRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("No se puede eliminar el aula porque está siendo usado en otros lugares.");
        }
    }
}