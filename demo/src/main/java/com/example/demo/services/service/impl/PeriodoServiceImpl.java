package com.example.demo.services.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.Periodo;
import com.example.demo.repositories.repository.PeriodoRepository;
import com.example.demo.services.service.PeriodoService;

@Service
public class PeriodoServiceImpl implements PeriodoService {

    @Autowired
    private PeriodoRepository periodoRepository;

    @Override
    public List<Periodo> findAll() {
        return periodoRepository.findAll();
    }

    @Override
    public Optional<Periodo> findById(Integer id) {
        return periodoRepository.findById(id);
    }

    @Override
    public Periodo save(Periodo periodo) {
        return periodoRepository.save(periodo);
    }

    @Override
    public void deleteById(Integer id) {
        periodoRepository.deleteById(id);
    }
}
