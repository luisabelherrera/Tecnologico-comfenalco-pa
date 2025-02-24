package com.example.demo.model.entity.dto;

import java.util.List;

import com.example.demo.model.entity.Noticia;

import lombok.Data;
@Data
public class NoticiaDTO {
    private String titulo;
    private String contenido;
    private byte[] imagen;
    private String tipoImagen;
    private List<Noticia.Comentario> comentarios; // Campo para comentarios
    private int likes; // Campo para likes
}