package com.example.demo.services.service;

import com.example.demo.model.entity.Mensaje;

import java.util.List;


public interface ChatService {

	public List<Mensaje> obtenerUltimos10Mensajes();
	public Mensaje guardar(Mensaje mensaje);
	public List<Mensaje> obtenerHistorialEntre(String user1, String user2);
}
