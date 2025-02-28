package com.example.demo.controller.entityController;

import com.example.demo.model.entity.Noticia;
import com.example.demo.model.entity.dto.NoticiaDTO;
import com.example.demo.repositories.mongo.NoticiaRepository;
import com.example.demo.services.service.NoticiaService;
import com.example.demo.exceptions.customexceptions.exceptionsEntity.NoticiaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/noticias")
public class NoticiaController {

    @Autowired
    private NoticiaService noticiaService;

    @Autowired
    private NoticiaRepository noticiaRepository;

    @PostMapping("/crear")
    public ResponseEntity<Noticia> crearNoticia(
            @RequestParam("titulo") String titulo,
            @RequestParam("contenido") String contenido,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen,
            @RequestParam(value = "video", required = false) MultipartFile video) {
        System.out.println("Received request to create noticia: " + titulo);
        NoticiaDTO noticiaDTO = new NoticiaDTO();
        noticiaDTO.setTitulo(titulo);
        noticiaDTO.setContenido(contenido);
        noticiaDTO.setImagen(imagen);
        noticiaDTO.setVideo(video);
    
        try {
            Noticia noticia = noticiaService.crearNoticia(noticiaDTO);
            return new ResponseEntity<>(noticia, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("Error creating noticia: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
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
        if (noticia == null || noticia.getImagenPath() == null) {
            throw new NoticiaException("Noticia o imagen no encontrada con id: " + id);
        }
        try {
            byte[] imagenBytes = Files.readAllBytes(Paths.get(noticia.getImagenPath()));
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG) // Adjust based on file type
                    .body(imagenBytes);
        } catch (IOException e) {
            throw new NoticiaException("Error al leer la imagen: " + id);
        }
    }

    @GetMapping("/video/{id}")
    public ResponseEntity<byte[]> obtenerVideoNoticia(@PathVariable String id) {
        Noticia noticia = noticiaService.obtenerNoticiaPorId(id);
        if (noticia == null || noticia.getVideoPath() == null) {
            System.out.println("Video not found for noticia ID: " + id);
            throw new NoticiaException("Noticia o video no encontrada con id: " + id);
        }
        try {
            byte[] videoBytes = Files.readAllBytes(Paths.get(noticia.getVideoPath()));
            String contentType = Files.probeContentType(Paths.get(noticia.getVideoPath()));
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType != null ? contentType : "video/mp4"))
                    .body(videoBytes);
        } catch (IOException e) {
            System.err.println("Error reading video for ID " + id + ": " + e.getMessage());
            throw new NoticiaException("Error al leer el video: " + id);
        }
    }

    // Actualizar una noticia
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<Noticia> actualizarNoticia(
            @PathVariable String id,
            @RequestParam("titulo") String titulo,
            @RequestParam("contenido") String contenido,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen,
            @RequestParam(value = "video", required = false) MultipartFile video) {
        NoticiaDTO noticiaDTO = new NoticiaDTO();
        noticiaDTO.setTitulo(titulo);
        noticiaDTO.setContenido(contenido);
        noticiaDTO.setImagen(imagen);
        noticiaDTO.setVideo(video);

        Noticia noticiaActualizada = noticiaService.actualizarNoticia(id, noticiaDTO);
        if (noticiaActualizada != null) {
            return new ResponseEntity<>(noticiaActualizada, HttpStatus.OK);
        } else {
            throw new NoticiaException("Noticia no encontrada con id: " + id);
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