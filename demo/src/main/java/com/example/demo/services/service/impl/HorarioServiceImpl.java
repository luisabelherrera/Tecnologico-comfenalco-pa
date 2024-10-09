package com.example.demo.services.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.Horario;
import com.example.demo.repositories.repository.HorarioRepository;
import com.example.demo.services.service.HorarioService;

import java.util.List;
import java.util.Optional;

@Service
public class HorarioServiceImpl implements HorarioService {

    @Autowired
    private HorarioRepository horarioRepository;

    @Override
    public List<Horario> findAll() {
        return horarioRepository.findAll();
    }

    @Override
    public Optional<Horario> findById(Integer id) {
        return horarioRepository.findById(id);
    }

    @Override
    public Horario save(Horario horario) {
        return horarioRepository.save(horario);
    }

    @Override
    public void deleteById(Integer id) {
        horarioRepository.deleteById(id);
    }
}
