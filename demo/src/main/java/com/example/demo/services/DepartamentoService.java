package com.example.demo.services;


import com.example.demo.model.entities.Departamento;

import java.util.List;
import java.util.Optional;

public interface DepartamentoService {

    Departamento saveDepartamento(Departamento departamento);
    Optional<Departamento> getDepartamentoById(Long id);
    List<Departamento> getAllDepartamentos();
    Departamento updateDepartamento(Departamento departamento);
    void deleteDepartamento(Long id);
}