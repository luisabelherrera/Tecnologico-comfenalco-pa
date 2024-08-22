package com.example.demo.services.impl;

import com.example.demo.model.entities.Departamento;
import com.example.demo.repositories.DepartamentoRepository;
import com.example.demo.services.DepartamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DepartamentoServiceImpl implements DepartamentoService {

    private final DepartamentoRepository departamentoRepository;

    @Autowired
    public DepartamentoServiceImpl(DepartamentoRepository departamentoRepository) {
        this.departamentoRepository = departamentoRepository;
    }

    @Override
    public Departamento saveDepartamento(Departamento departamento) {
        return departamentoRepository.save(departamento);
    }

    @Override
    public Optional<Departamento> getDepartamentoById(Long id) {
        return departamentoRepository.findById(id);
    }

    @Override
    public List<Departamento> getAllDepartamentos() {
        return departamentoRepository.findAll();
    }

    @Override
    public Departamento updateDepartamento(Departamento departamento) {
        return departamentoRepository.save(departamento);
    }

    @Override
    public void deleteDepartamento(Long id) {
        departamentoRepository.deleteById(id);
    }
}