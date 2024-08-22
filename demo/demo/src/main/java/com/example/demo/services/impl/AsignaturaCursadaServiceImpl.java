package com.example.demo.services.impl;

import com.example.demo.model.entities.AsignaturaCursada;
import com.example.demo.repositories.AsignaturaCursadaRepository;
import com.example.demo.services.AsignaturaCursadaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AsignaturaCursadaServiceImpl implements AsignaturaCursadaService {

    @Autowired
    private AsignaturaCursadaRepository asignaturaCursadaRepository;


    @Override
    public void guardar(AsignaturaCursada asignaturaCursada) {
        asignaturaCursadaRepository.save(asignaturaCursada);
    }

    @Override
    public void actualizar(AsignaturaCursada asignaturaCursada) {
        asignaturaCursadaRepository.save(asignaturaCursada);
    }

    @Override
    public AsignaturaCursada obtenerPorId(Long id) {
        return asignaturaCursadaRepository.findById(id).orElse(null);
    }

    @Override
    public List<AsignaturaCursada> listar() {
        return asignaturaCursadaRepository.findAll();
    }

    @Override
    public void eliminar(Long id) {
        asignaturaCursadaRepository.deleteById(id);
    }
}