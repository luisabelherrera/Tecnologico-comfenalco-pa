package com.example.demo.repositories.mongo;


import com.example.demo.model.entity.PrecioNivelEducativo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrecioNivelEducativoRepository extends MongoRepository<PrecioNivelEducativo, String> {
    // Puedes agregar métodos personalizados si lo necesitas
}