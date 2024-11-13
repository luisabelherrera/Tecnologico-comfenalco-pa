package com.example.demo.model.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NoticiaDTO implements Serializable {

    
    private String titulo;
    private String contenido;
    private byte[] imagen;
    private String tipoImagen;
}
