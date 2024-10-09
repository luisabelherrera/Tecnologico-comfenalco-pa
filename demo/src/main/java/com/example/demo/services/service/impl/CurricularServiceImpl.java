package com.example.demo.services.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.Curricular;
import com.example.demo.repositories.repository.CurricularRepository;
import com.example.demo.services.service.CurricularService;

import java.util.List;
import java.util.Optional;

@Service
public class CurricularServiceImpl implements CurricularService {

    @Autowired
    private CurricularRepository curricularRepository;

    @Override
    public List<Curricular> findAll() {
        return curricularRepository.findAll();
    }

    @Override
    public Optional<Curricular> findById(Integer id) {
        return curricularRepository.findById(id);
    }

    @Override
    public Curricular save(Curricular curricular) {
        return curricularRepository.save(curricular);
    }

    @Override
    public void deleteById(Integer id) {
        curricularRepository.deleteById(id);
    }
}
