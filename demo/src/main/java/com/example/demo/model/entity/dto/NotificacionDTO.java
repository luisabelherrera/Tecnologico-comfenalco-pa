package com.example.demo.model.entity.dto;

import java.time.LocalDateTime;

public class NotificacionDTO {
    private String id;
    private String titulo;
    private String mensaje;
    private boolean leida;
    private LocalDateTime fechaHora;

    public NotificacionDTO(String id, String titulo, String mensaje, boolean leida, LocalDateTime fechaHora) {
        this.id = id;
        this.titulo = titulo;
        this.mensaje = mensaje;
        this.leida = leida;
        this.fechaHora = fechaHora;
    }

    // Getters y setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public String getMensaje() { return mensaje; }
    public void setMensaje(String mensaje) { this.mensaje = mensaje; }
    public boolean isLeida() { return leida; }
    public void setLeida(boolean leida) { this.leida = leida; }
    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }
}
