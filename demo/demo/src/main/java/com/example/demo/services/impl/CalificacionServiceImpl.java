package com.example.demo.services.impl;

import com.example.demo.model.entities.Calificacion;
import com.example.demo.repositories.CalificacionRepository;
import com.example.demo.services.CalificacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;



@Service
public class CalificacionServiceImpl implements CalificacionService {


    @Autowired
    private CalificacionRepository calificacionRepository;

    @Override
    public List<Calificacion> listar() {
        return calificacionRepository.findAll();
    }

    @Override
    public Optional<Calificacion> buscarPorId(Long id) {
        return calificacionRepository.findById(id);
    }

    @Override
    public void actualizar(Calificacion calificacion) {

        Calificacion calificacionExistente = calificacionRepository.findById(calificacion.getId()).orElse(null);

        if (calificacionExistente != null) {
             calificacionExistente.setValorCalificacion(calificacion.getValorCalificacion());
            calificacionExistente.setComentario(calificacion.getComentario());
            calificacionExistente.setPeriodo(calificacion.getPeriodo());

            calificacionExistente.setAsignaturaCursada(calificacion.getAsignaturaCursada());

             calificacionRepository.save(calificacionExistente);
        }
    }

    @Override
    public Calificacion guardar(Calificacion calificacion) {
        return calificacionRepository.save(calificacion);
    }

    @Override
    public void eliminar(Long id) {
        calificacionRepository.deleteById(id);
    }
}