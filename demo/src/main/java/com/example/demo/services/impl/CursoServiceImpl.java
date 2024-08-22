package com.example.demo.services.impl;

import com.example.demo.model.entities.Curso;
import com.example.demo.repositories.CursoRepository;
import com.example.demo.services.CursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CursoServiceImpl implements CursoService {

    private final CursoRepository cursoRepository;

    @Autowired
    public CursoServiceImpl(CursoRepository cursoRepository) {
        this.cursoRepository = cursoRepository;
    }

    @Override
    public Curso saveCurso(Curso curso) {
        return cursoRepository.save(curso);
    }

    @Override
    public Optional<Curso> getCursoById(Long id) {
        return cursoRepository.findById(id);
    }

    @Override
    public List<Curso> getAllCursos() {
        return cursoRepository.findAll();
    }

    @Override
    public Curso updateCurso(Curso curso) {
        return cursoRepository.save(curso);
    }

    @Override
    public void deleteCurso(Long id) {
        cursoRepository.deleteById(id);
    }
}