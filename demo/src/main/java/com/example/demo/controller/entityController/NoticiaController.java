package com.example.demo.controller.entityController;

import com.example.demo.model.entity.Noticia;
import com.example.demo.model.entity.dto.NoticiaDTO;
import com.example.demo.services.service.NoticiaService;
import com.example.demo.exceptions.customexceptions.exceptionsEntity.NoticiaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/noticias")
public class NoticiaController {

    @Autowired
    private NoticiaService noticiaService;

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

    @GetMapping
    public List<Noticia> obtenerNoticias() {
        return noticiaService.obtenerNoticias();
    }

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

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> eliminarNoticia(@PathVariable String id) {
        if (noticiaService.obtenerNoticiaPorId(id) == null) {
            throw new NoticiaException("No se puede eliminar. Noticia no encontrada con id: " + id);
        }
        noticiaService.eliminarNoticia(id);
        return ResponseEntity.noContent().build(); // Devuelve un 204 No Content
    }
}
