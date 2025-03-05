package com.example.demo.services.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.GradoSeccion;
import com.example.demo.repositories.jpa.GradoSeccionRepository;
import com.example.demo.services.service.GradoSeccionService;

import java.util.List;
import java.util.Optional;

@Service
public class GradoSeccionServiceImpl implements GradoSeccionService {

    @Autowired
    private GradoSeccionRepository gradoSeccionRepository;

    @Override
    public List<GradoSeccion> findAll() {
        return gradoSeccionRepository.findAll();
    }

    @Override
    public Optional<GradoSeccion> findById(Integer id) {
        return gradoSeccionRepository.findById(id);
    }

    @Override
    public GradoSeccion save(GradoSeccion gradoSeccion) {
        if (gradoSeccion == null) {
            throw new IllegalArgumentException("El gradoSeccion no puede ser nulo");
        }
        try {
            return gradoSeccionRepository.save(gradoSeccion);
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar el gradoSeccion: " + e.getMessage(), e);
        }
    }
    @Override
    public void deleteById(Integer id) {
        gradoSeccionRepository.deleteById(id);
    }
}
