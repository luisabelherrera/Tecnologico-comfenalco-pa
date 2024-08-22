package com.example.demo.repositories;

import com.example.demo.model.entities.Periodo;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PeriodoRepository extends CrudRepository<Periodo, Long> {
}