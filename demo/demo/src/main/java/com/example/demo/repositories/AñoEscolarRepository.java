package com.example.demo.repositories;


import com.example.demo.model.entities.AñoEscolar;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AñoEscolarRepository extends CrudRepository<AñoEscolar, Long> {


}