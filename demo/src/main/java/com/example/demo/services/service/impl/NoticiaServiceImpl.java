package com.example.demo.services.service.impl;

import com.example.demo.model.entity.Noticia;
import com.example.demo.model.entity.dto.NoticiaDTO;
import com.example.demo.repositories.mongo.NoticiaRepository;
import com.example.demo.services.service.NoticiaService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NoticiaServiceImpl implements NoticiaService {

    @Autowired
    private NoticiaRepository noticiaRepository;



    @CacheEvict(value = "Noticiacache", allEntries = true)
    public Noticia crearNoticia(NoticiaDTO noticiaDTO) {
        Noticia noticia = new Noticia();
        noticia.setTitulo(noticiaDTO.getTitulo());
        noticia.setContenido(noticiaDTO.getContenido());
        noticia.setImagen(noticiaDTO.getImagen());
        noticia.setTipoImagen(noticiaDTO.getTipoImagen());
        noticia.setFechaCreacion(LocalDateTime.now());
        return noticiaRepository.save(noticia);
    }
    @Cacheable("Noticiacache")
    public List<Noticia> obtenerNoticias() {
        return noticiaRepository.findAll();
    }

    @Override
    public Noticia obtenerNoticiaPorId(String id) {
        return noticiaRepository.findById(id).orElse(null);
    }

    @Override
    public Noticia actualizarNoticia(String id, NoticiaDTO noticiaDTO) {
        Optional<Noticia> optionalNoticia = noticiaRepository.findById(id);
        if (optionalNoticia.isPresent()) {
            Noticia noticia = optionalNoticia.get();
            noticia.setTitulo(noticiaDTO.getTitulo());
            noticia.setContenido(noticiaDTO.getContenido());
            noticia.setImagen(noticiaDTO.getImagen());
            noticia.setTipoImagen(noticiaDTO.getTipoImagen());
            return noticiaRepository.save(noticia);
        }
        return null; // O lanza una excepción
    }


    @CacheEvict(value = "Noticiacache", allEntries = true)
    public void eliminarNoticia(String id) {
        noticiaRepository.deleteById(id);
    }
}
