package com.example.demo.services.service.impl;

import com.example.demo.model.entity.Noticia;
import com.example.demo.model.entity.dto.NoticiaDTO;
import com.example.demo.repositories.mongo.NoticiaRepository;
import com.example.demo.services.service.NoticiaService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NoticiaServiceImpl implements NoticiaService {
    @Autowired
    private NoticiaRepository noticiaRepository;

    @Override
    public Noticia crearNoticia(NoticiaDTO noticiaDTO) {
        Noticia noticia = new Noticia();
        noticia.setTitulo(noticiaDTO.getTitulo());
        noticia.setContenido(noticiaDTO.getContenido());
        noticia.setImagen(noticiaDTO.getImagen());
        noticia.setTipoImagen(noticiaDTO.getTipoImagen());
        noticia.setFechaCreacion(new Date());
        noticia.setLikesCount(0);
        noticia.setLikedBy(new ArrayList<>());
        noticia.setComentarios(new ArrayList<>());
        return noticiaRepository.save(noticia);
    }

    @Override
    public List<Noticia> obtenerNoticias() {
        return noticiaRepository.findAll();
    }

    @Override
    public Noticia obtenerNoticiaPorId(String id) {
        return noticiaRepository.findById(id).orElse(null);
    }

    @Override
    public Noticia actualizarNoticia(String id, NoticiaDTO noticiaDTO) {
        Noticia noticia = noticiaRepository.findById(id).orElse(null);
        if (noticia != null) {
            noticia.setTitulo(noticiaDTO.getTitulo());
            noticia.setContenido(noticiaDTO.getContenido());
            if (noticiaDTO.getImagen() != null) {
                noticia.setImagen(noticiaDTO.getImagen());
                noticia.setTipoImagen(noticiaDTO.getTipoImagen());
            }
            return noticiaRepository.save(noticia);
        }
        return null;
    }

    @Override
    public void eliminarNoticia(String id) {
        noticiaRepository.deleteById(id);
    }

    @Override
    public Noticia agregarComentario(String id, Noticia.Comentario comentario) {
        Noticia noticia = noticiaRepository.findById(id).orElse(null);
        if (noticia != null) {
            if (noticia.getComentarios() == null) {
                noticia.setComentarios(new ArrayList<>());
            }
            comentario.setFechaCreacion(new Date());
            noticia.getComentarios().add(comentario);
            return noticiaRepository.save(noticia);
        }
        return null;
    }

    @Override
public Noticia darLike(String id) {
    Noticia noticia = noticiaRepository.findById(id).orElse(null);
    if (noticia != null) {
        if (noticia.getLikesCount() == null) {
            noticia.setLikesCount(0);
        }
        if (noticia.getLikedBy() == null) {
            noticia.setLikedBy(new ArrayList<>());
        }
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!noticia.getLikedBy().contains(username)) { // Prevent duplicate likes
            noticia.setLikesCount(noticia.getLikesCount() + 1);
            noticia.getLikedBy().add(username);
            return noticiaRepository.save(noticia);
        }
        return noticia; // No change if already liked
    }
    return null;
}
}