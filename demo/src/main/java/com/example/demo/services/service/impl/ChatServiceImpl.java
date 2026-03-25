package com.example.demo.services.service.impl;

import java.util.List;

import com.example.demo.model.entity.Mensaje;
import com.example.demo.repositories.mongo.ChatRepository;
import com.example.demo.services.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatServiceImpl implements ChatService {
	
	@Autowired
	private ChatRepository chatDao;

	@Override
	public List<Mensaje> obtenerUltimos10Mensajes() {
		return chatDao.findFirst10ByOrderByFechaDesc();
	}

	@Override
	public Mensaje guardar(Mensaje mensaje) {
		return chatDao.save(mensaje);
	}

	@Override
	public List<Mensaje> obtenerHistorialEntre(String user1, String user2) {
		return chatDao.findByUsernameAndDestinatarioOrUsernameAndDestinatarioOrderByFechaAsc(
			user1, user2, user2, user1
		);
	}
}
