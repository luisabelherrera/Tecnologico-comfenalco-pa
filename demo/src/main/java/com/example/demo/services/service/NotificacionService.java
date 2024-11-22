package com.example.demo.services.service;

import com.example.demo.model.entity.dto.NotificacionDTO;

import java.util.List;

public interface NotificacionService {
    List<NotificacionDTO> obtenerTodas();
    NotificacionDTO obtenerPorId(String id);
    NotificacionDTO crearNotificacion(NotificacionDTO notificacionDTO);
    void eliminarNotificacion(String id);
    NotificacionDTO marcarComoLeida(String id);
}
