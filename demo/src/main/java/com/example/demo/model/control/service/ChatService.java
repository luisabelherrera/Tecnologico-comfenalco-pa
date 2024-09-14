package com.example.demo.model.control.service;

import java.util.List;

import com.example.demo.model.control.documents.Mensaje;

public interface ChatService {

	public List<Mensaje> obtenerUltimos10Mensajes();

	public Mensaje guardar(Mensaje mensaje);
}
