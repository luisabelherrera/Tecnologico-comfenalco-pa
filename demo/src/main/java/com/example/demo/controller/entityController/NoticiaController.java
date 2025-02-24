package com.example.demo.controller.entityController;

import com.example.demo.model.entity.Noticia;
import com.example.demo.model.entity.dto.NoticiaDTO;
import com.example.demo.repositories.mongo.NoticiaRepository;
import com.example.demo.services.service.NoticiaService;
import com.example.demo.services.service.impl.NoticiaServiceImpl;
import com.example.demo.exceptions.customexceptions.exceptionsEntity.NoticiaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/noticias")
public class NoticiaController {

    @Autowired
    private NoticiaService noticiaService;


    @Autowired
    private  NoticiaRepository  noticiaRepository;

    // Crear una noticia
    @PostMapping("/crear")
    public ResponseEntity<Noticia> crearNoticia(
            @RequestParam("titulo") String titulo,
            @RequestParam("contenido") String contenido,
            @RequestParam("imagen") MultipartFile imagen) {
        try {
            NoticiaDTO noticiaDTO = new NoticiaDTO();
            noticiaDTO.setTitulo(titulo);
            noticiaDTO.setContenido(contenido);
            noticiaDTO.setImagen(imagen.getBytes());
            noticiaDTO.setTipoImagen(imagen.getContentType());

            Noticia noticia = noticiaService.crearNoticia(noticiaDTO);
            return new ResponseEntity<>(noticia, HttpStatus.CREATED);
        } catch (IOException e) {
            throw new NoticiaException("Error al cargar la imagen de la noticia.");
        }
    }

    // Obtener todas las noticias
    @GetMapping
    public List<Noticia> obtenerNoticias() {
        return noticiaService.obtenerNoticias();
    }

    // Obtener la imagen de una noticia
    @GetMapping("/imagen/{id}")
    public ResponseEntity<byte[]> obtenerImagenNoticia(@PathVariable String id) {
        Noticia noticia = noticiaService.obtenerNoticiaPorId(id);
        if (noticia == null || noticia.getImagen() == null) {
            throw new NoticiaException("Noticia no encontrada con id: " + id);
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(noticia.getTipoImagen()))
                .body(noticia.getImagen());
    }

    // Actualizar una noticia
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Noticia> actualizarNoticia(
            @PathVariable String id,
            @RequestParam("titulo") String titulo,
            @RequestParam("contenido") String contenido,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) {
        try {
            NoticiaDTO noticiaDTO = new NoticiaDTO();
            noticiaDTO.setTitulo(titulo);
            noticiaDTO.setContenido(contenido);
            if (imagen != null) {
                noticiaDTO.setImagen(imagen.getBytes());
                noticiaDTO.setTipoImagen(imagen.getContentType());
            }

            Noticia noticiaActualizada = noticiaService.actualizarNoticia(id, noticiaDTO);
            if (noticiaActualizada != null) {
                return new ResponseEntity<>(noticiaActualizada, HttpStatus.OK);
            } else {
                throw new NoticiaException("Noticia no encontrada con id: " + id);
            }
        } catch (IOException e) {
            throw new NoticiaException("Error al cargar la imagen de la noticia.");
        }
    }

    // Eliminar una noticia
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarNoticia(@PathVariable String id) {
        if (noticiaService.obtenerNoticiaPorId(id) == null) {
            throw new NoticiaException("No se puede eliminar. Noticia no encontrada con id: " + id);
        }
        noticiaService.eliminarNoticia(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{id}/likes")
    public Noticia updateLikes(@PathVariable String id, @RequestBody Map<String, List<String>> body) {
        Noticia noticia = noticiaRepository.findById(id).orElseThrow();
        noticia.setLikedBy(body.get("likedBy"));
        noticia.setLikesCount(body.get("likedBy").size());
        return noticiaRepository.save(noticia);
    }
    // Agregar un comentario a una noticia
    @PostMapping("/{id}/comentarios")
    public ResponseEntity<Noticia> agregarComentario(
            @PathVariable String id,
            @RequestBody Noticia.Comentario comentario) {
        Noticia noticia = noticiaService.agregarComentario(id, comentario);
        if (noticia != null) {
            return new ResponseEntity<>(noticia, HttpStatus.OK);
        } else {
            throw new NoticiaException("Noticia no encontrada con id: " + id);
        }
    }

    // Dar like a una noticia
    @PostMapping("/{id}/likes")
    public ResponseEntity<Noticia> darLike(@PathVariable String id) {
        Noticia noticia = noticiaService.darLike(id);
        if (noticia != null) {
            return new ResponseEntity<>(noticia, HttpStatus.OK);
        } else {
            throw new NoticiaException("Noticia no encontrada con id: " + id);
        }
    }
}