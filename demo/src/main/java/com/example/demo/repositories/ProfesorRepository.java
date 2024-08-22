package com.example.demo.repositories;


import com.example.demo.model.entities.Profesor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ProfesorRepository extends JpaRepository<Profesor, Long> {
}