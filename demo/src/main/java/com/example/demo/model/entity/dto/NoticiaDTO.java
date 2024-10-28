package com.example.demo.model.entity.dto;

import lombok.Data;

@Data
public class NoticiaDTO {

    private String titulo;
    private String contenido;
    private byte[] imagen;
    private String tipoImagen;
}
