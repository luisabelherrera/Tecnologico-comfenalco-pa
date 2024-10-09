package com.example.demo.services.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.Acudiente;
import com.example.demo.repositories.repository.AcudienteRepository;
import com.example.demo.services.service.AcudienteService;

@Service
public class AcudienteServiceImpl implements AcudienteService {

    @Autowired
    private AcudienteRepository acudienteRepository;

    @Override
    public List<Acudiente> findAll() {
        return acudienteRepository.findAll();
    }

    @Override
    public Optional<Acudiente> findById(Integer id) {
        return acudienteRepository.findById(id);
    }

    @Override
    public Acudiente save(Acudiente acudiente) {
        return acudienteRepository.save(acudiente);
    }

    @Override
    public void deleteById(Integer id) {
        acudienteRepository.deleteById(id);
    }
}
