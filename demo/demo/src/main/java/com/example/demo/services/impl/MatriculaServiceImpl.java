package com.example.demo.services.impl;


import com.example.demo.model.entities.Matricula;
import com.example.demo.repositories.MatriculaRepository;
import com.example.demo.services.MatriculaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;


@Service
public class MatriculaServiceImpl implements MatriculaService {


    @Autowired
    private MatriculaRepository matriculaRepository;


    @Override
    public Matricula crear(Matricula matricula) {
        return matriculaRepository.save(matricula);
    }


    @Override
    public Iterable<Matricula> listar() {
        return matriculaRepository.findAll();
    }


    @Override
    public Optional<Matricula> obtenerPorId(Long id) {
        return matriculaRepository.findById(id);
    }

    @Override
    public Matricula actualizar(Long id, Matricula matriculaDetalles) {
        Optional<Matricula> optionalMatricula = matriculaRepository.findById(id);
        if (optionalMatricula.isPresent()) {
            Matricula matriculaExistente = optionalMatricula.get();

            matriculaExistente.setEstado(matriculaDetalles.getEstado());
            matriculaExistente.setFechaMatricula(matriculaDetalles.getFechaMatricula());
           matriculaExistente.setEstudiante(matriculaDetalles.getEstudiante());
            matriculaExistente.setCurso(matriculaDetalles.getCurso());

            return matriculaRepository.save(matriculaExistente);
        } else {

            return null;
        }
    }


    @Override
    public void eliminarPorId(Long id) {
        matriculaRepository.deleteById(id);
    }
}