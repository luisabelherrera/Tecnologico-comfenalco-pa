package com.example.demo.repositories.mongo;

import com.example.demo.model.entity.Noticia;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoticiaRepository extends MongoRepository<Noticia, String> {
}
