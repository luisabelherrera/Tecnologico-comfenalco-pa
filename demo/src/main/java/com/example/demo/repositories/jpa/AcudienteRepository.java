package com.example.demo.repositories.jpa;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.Acudiente;

@Repository
public interface AcudienteRepository extends JpaRepository<Acudiente, Integer>, JpaSpecificationExecutor<Acudiente> {
    // No need for custom methods if using Specification
}