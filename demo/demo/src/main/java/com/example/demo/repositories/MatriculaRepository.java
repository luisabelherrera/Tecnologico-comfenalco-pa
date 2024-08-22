package com.example.demo.repositories;


import com.example.demo.model.entities.Matricula;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatriculaRepository extends CrudRepository<Matricula, Long> {

}
