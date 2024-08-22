package com.example.demo.services.impl;

import com.example.demo.model.entities.Curso;
import com.example.demo.repositories.CursoRepository;
import com.example.demo.services.CursoService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CursoServiceImpl implements CursoService {

    private final CursoRepository cursoRepository;

    @Autowired
    public CursoServiceImpl(CursoRepository cursoRepository) {
        this.cursoRepository = cursoRepository;
    }

    @Override
    public Iterable<Curso> listar() {
        return cursoRepository.findAll();
    }

    @Override
    public Curso crear(Curso curso) {
        return cursoRepository.save(curso);
    }

    @Override
    public Curso actualizar(Long id, Curso cursoDetalles) {
        Optional<Curso> cursoExistente = cursoRepository.findById(id);
        if (cursoExistente.isPresent()) {
            Curso cursoActualizado = cursoExistente.get();
            cursoActualizado.setNombre(cursoDetalles.getNombre());
            cursoActualizado.setAnioEscolar(cursoDetalles.getAnioEscolar());
            return cursoRepository.save(cursoActualizado);
        } else {
            throw new EntityNotFoundException("Curso no encontrado");
        }
    }

    @Override
    public void eliminar(Long id) {
        cursoRepository.deleteById(id);
    }

    @Override
    public Optional<Curso> obtenerPorId(Long id) {
        return cursoRepository.findById(id);
    }
}