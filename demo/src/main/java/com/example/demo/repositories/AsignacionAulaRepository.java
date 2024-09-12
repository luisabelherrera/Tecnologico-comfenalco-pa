package com.example.demo.repositories;

import com.example.demo.model.entities.AsignacionAula;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;


@Repository
public interface AsignacionAulaRepository extends JpaRepository<AsignacionAula, Long> {

}