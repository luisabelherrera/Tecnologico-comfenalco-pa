package com.example.demo.services.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.NivelDetalleCurso;
import com.example.demo.repositories.repository.NivelDetalleCursoRepository;
import com.example.demo.services.service.NivelDetalleCursoService;

import java.util.List;
import java.util.Optional;

@Service
public class NivelDetalleCursoServiceImpl implements NivelDetalleCursoService {

    @Autowired
    private NivelDetalleCursoRepository nivelDetalleCursoRepository;

    @Override
    public List<NivelDetalleCurso> findAll() {
        return nivelDetalleCursoRepository.findAll();
    }

    @Override
    public Optional<NivelDetalleCurso> findById(Integer id) {
        return nivelDetalleCursoRepository.findById(id);
    }

    @Override
    public NivelDetalleCurso save(NivelDetalleCurso nivelDetalleCurso) {
        return nivelDetalleCursoRepository.save(nivelDetalleCurso);
    }

    @Override
    public void deleteById(Integer id) {
        nivelDetalleCursoRepository.deleteById(id);
    }
}
