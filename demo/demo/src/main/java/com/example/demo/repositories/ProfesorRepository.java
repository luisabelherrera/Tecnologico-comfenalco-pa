package com.example.demo.repositories;


import com.example.demo.model.entities.Profesor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfesorRepository extends  CrudRepository<Profesor, Long> {
    List<Profesor> findByNombreCompletoContaining(String nombreCompleto);
}