package com.example.demo.repositories.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.Periodo;

@Repository
public interface PeriodoRepository extends JpaRepository<Periodo, Integer> {
}
