package com.example.demo.repositories.mongo;

import java.util.List;

import com.example.demo.model.entity.Mensaje;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface ChatRepository extends MongoRepository<Mensaje, String>{
	
    public List<Mensaje> findFirst10ByOrderByFechaDesc();

    // Buscar mensajes entre dos usuarios (Privados)
    public List<Mensaje> findByUsernameAndDestinatarioOrUsernameAndDestinatarioOrderByFechaAsc(
        String userA, String recipientA, String userB, String recipientB
    );
}
