package com.example.demo.model.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "noticias")
public class Noticia {
    @Id
    private String id;
    private String titulo;
    private String contenido;
    private byte[] imagen;
    private String tipoImagen;
    private Date fechaCreacion;
    private Integer likesCount = 0; // Changed from 'likes' to 'likesCount' to match MongoDB
    private List<String> likedBy = new ArrayList<>(); // Matches MongoDB field
    private List<Comentario> comentarios = new ArrayList<>();

    @Data
    public static class Comentario {
        private String autor;
        private String contenido;
        private Date fechaCreacion;
    }
}