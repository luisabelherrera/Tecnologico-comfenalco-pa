package com.example.demo.services.service;

import com.example.demo.model.entity.Noticia;
import com.example.demo.model.entity.dto.NoticiaDTO;

import java.util.List;

public interface NoticiaService {
    Noticia crearNoticia(NoticiaDTO noticiaDTO);
    List<Noticia> obtenerNoticias();
    Noticia obtenerNoticiaPorId(String id);
    Noticia actualizarNoticia(String id, NoticiaDTO noticiaDTO); // Nuevo método
    void eliminarNoticia(String id); // Nuevo método
}
