package com.example.demo.services.service;

import com.example.demo.model.entity.Noticia;
import com.example.demo.model.entity.dto.NoticiaDTO;

import java.util.List;

public interface NoticiaService {
    Noticia crearNoticia(NoticiaDTO noticiaDTO);
    List<Noticia> obtenerNoticias();
    Noticia obtenerNoticiaPorId(String id);
    Noticia actualizarNoticia(String id, NoticiaDTO noticiaDTO);
    void eliminarNoticia(String id);
    Noticia agregarComentario(String id, Noticia.Comentario comentario);
    Noticia darLike(String id);
}