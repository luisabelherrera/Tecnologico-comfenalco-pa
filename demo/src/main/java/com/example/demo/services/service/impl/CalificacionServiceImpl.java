package com.example.demo.services.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.Calificacion;
import com.example.demo.repositories.jpa.CalificacionRepository;
import com.example.demo.services.service.CalificacionService;

import java.util.List;
import java.util.Optional;

@Service
public class CalificacionServiceImpl implements CalificacionService {

    @Autowired
    private CalificacionRepository calificacionRepository;

    @Override
    public List<Calificacion> findAll() {
        return calificacionRepository.findAll();
    }

    @Override
    public Optional<Calificacion> findById(Integer id) {
        return calificacionRepository.findById(id);
    }

    @Override
    public List<Calificacion> findByDocenteId(Integer idDocente) {
        return calificacionRepository.findByCurricularDocenteNivelDetalleCursoDocenteIdDocente(idDocente);
    }

    @Override
    public List<Calificacion> findByCurricularId(Integer idCurricular) {
        return calificacionRepository.findByCurricularIdCurricular(idCurricular);
    }

    @Override
    public Calificacion save(Calificacion calificacion) {
        return calificacionRepository.save(calificacion);
    }

    @Override
    public void deleteById(Integer id) {
        calificacionRepository.deleteById(id);
    }
}