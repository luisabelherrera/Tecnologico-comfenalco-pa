package com.example.demo.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@Document(collection = "noticias")
public class Noticia {

    @Id
    private String id;
    private String titulo;
    private String contenido;
    private byte[] imagen;
    private String tipoImagen;
    private LocalDateTime fechaCreacion;

    public Noticia() {
        this.fechaCreacion = LocalDateTime.now();
    }


}
