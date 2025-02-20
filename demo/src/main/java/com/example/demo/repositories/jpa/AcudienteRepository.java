package com.example.demo.repositories.jpa;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.entity.Acudiente;

import java.util.List;

@Repository
public interface AcudienteRepository extends JpaRepository<Acudiente, Integer> {

    Page<Acudiente> findByNombresContainingIgnoreCaseOrDocumentoIdentidadContainingIgnoreCase(
            String nombres, String documentoIdentidad, Pageable pageable);

}

