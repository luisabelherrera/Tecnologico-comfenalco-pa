package com.example.demo.repositories;

import com.example.demo.model.entities.AsignaturaCursada;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;


@Repository
public interface AsignaturaCursadaRepository extends JpaRepository<AsignaturaCursada, Long> {

}