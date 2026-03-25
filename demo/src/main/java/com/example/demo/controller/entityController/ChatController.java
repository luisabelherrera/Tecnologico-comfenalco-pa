package com.example.demo.controller.entityController;

import java.util.Date;
import java.util.List;
import java.util.Random;

import com.example.demo.model.entity.Mensaje;
import com.example.demo.services.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatController {
	
	private String[] colores = {"red", "green", "blue", "magenta", "purple", "orange"};
	
	@Autowired
	private ChatService chatService;
	
	@Autowired
	private SimpMessagingTemplate webSocket;
	
	@MessageMapping("/mensaje")
	@SendTo("/chat/mensaje")
	public Mensaje recibeMensaje(Mensaje mensaje) {
		mensaje.setFecha(new Date().getTime());
		
		if(mensaje.getTipo().equals("NUEVO_USUARIO")) {
			mensaje.setColor(colores[new Random().nextInt(colores.length)]);
			if (mensaje.getTexto() == null || mensaje.getTexto().isEmpty()) {
				mensaje.setTexto("nuevo usuario");
			}
		} else {
			chatService.guardar(mensaje);
		}
		
		return mensaje;
	}

	@MessageMapping("/mensaje-privado")
	public void recibeMensajePrivado(Mensaje mensaje) {
		mensaje.setFecha(new Date().getTime());
		chatService.guardar(mensaje);
		
		// Enviar al destinatario
		webSocket.convertAndSendToUser(mensaje.getDestinatario(), "/queue/messages", mensaje);
		// Enviar al remitente (para que vea su propio mensaje en todos sus dispositivos)
		webSocket.convertAndSendToUser(mensaje.getUsername(), "/queue/messages", mensaje);
	}

	@GetMapping("/historial/{user1}/{user2}")
	public List<Mensaje> obtenerHistorial(@PathVariable String user1, @PathVariable String user2) {
		return chatService.obtenerHistorialEntre(user1, user2);
	}

	@MessageMapping("/escribiendo")
	@SendTo("/chat/escribiendo")
	public String estaEscribiendo(String username) {
		// Retornamos un JSON simple para que el cliente sepa quién escribe
		return "{\"username\":\"" + username + "\", \"escribiendo\": true}";
	}
	
	@GetMapping("/historial")
	public List<Mensaje> historial(){
		return chatService.obtenerUltimos10Mensajes();
	}

}
