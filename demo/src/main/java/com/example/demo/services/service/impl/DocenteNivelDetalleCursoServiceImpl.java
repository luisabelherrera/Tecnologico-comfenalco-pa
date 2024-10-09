package com.example.demo.services.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.DocenteNivelDetalleCurso;
import com.example.demo.repositories.repository.DocenteNivelDetalleCursoRepository;
import com.example.demo.services.service.DocenteNivelDetalleCursoService;

import java.util.List;
import java.util.Optional;

@Service
public class DocenteNivelDetalleCursoServiceImpl implements DocenteNivelDetalleCursoService {

    @Autowired
    private DocenteNivelDetalleCursoRepository docenteNivelDetalleCursoRepository;

    @Override
    public List<DocenteNivelDetalleCurso> findAll() {
        return docenteNivelDetalleCursoRepository.findAll();
    }

    @Override
    public Optional<DocenteNivelDetalleCurso> findById(Integer id) {
        return docenteNivelDetalleCursoRepository.findById(id);
    }

    @Override
    public DocenteNivelDetalleCurso save(DocenteNivelDetalleCurso docenteNivelDetalleCurso) {
        return docenteNivelDetalleCursoRepository.save(docenteNivelDetalleCurso);
    }

    @Override
    public void deleteById(Integer id) {
        docenteNivelDetalleCursoRepository.deleteById(id);
    }
}