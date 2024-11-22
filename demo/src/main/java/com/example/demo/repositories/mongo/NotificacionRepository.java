package com.example.demo.repositories.mongo;

import com.example.demo.model.entity.Notificacion;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NotificacionRepository extends MongoRepository<Notificacion, String> {
}