package com.example.demo.services.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.Docente;
import com.example.demo.repositories.repository.DocenteRepository;
import com.example.demo.services.service.DocenteService;

@Service
public class DocenteServiceImpl implements DocenteService {

    @Autowired
    private DocenteRepository docenteRepository;

    @Override
    public List<Docente> findAll() {
        return docenteRepository.findAll();
    }

    @Override
    public Optional<Docente> findById(Integer id) {
        return docenteRepository.findById(id);
    }

    @Override
    public Docente save(Docente docente) {
        return docenteRepository.save(docente);
    }

    @Override
    public void deleteById(Integer id) {
        docenteRepository.deleteById(id);
    }
}
