
package com.example.demo.model.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class Comentario implements Serializable {
    private String usuario;
    private String contenido;
    private LocalDateTime fechaCreacion;

    public Comentario() {
        this.fechaCreacion = LocalDateTime.now();
    }
}
