package com.example.demo.services.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.NivelDetalle;
import com.example.demo.repositories.repository.NivelDetalleRepository;
import com.example.demo.services.service.NivelDetalleService;

import java.util.List;
import java.util.Optional;

@Service
public class NivelDetalleServiceImpl implements NivelDetalleService {

    @Autowired
    private NivelDetalleRepository nivelDetalleRepository;

    @Override
    public List<NivelDetalle> findAll() {
        return nivelDetalleRepository.findAll();
    }

    @Override
    public Optional<NivelDetalle> findById(Integer id) {
        return nivelDetalleRepository.findById(id);
    }

    @Override
    public NivelDetalle save(NivelDetalle nivelDetalle) {
        return nivelDetalleRepository.save(nivelDetalle);
    }

    @Override
    public void deleteById(Integer id) {
        nivelDetalleRepository.deleteById(id);
    }
}
