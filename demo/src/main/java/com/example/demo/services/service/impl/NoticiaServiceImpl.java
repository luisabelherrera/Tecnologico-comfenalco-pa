package com.example.demo.services.service.impl;

import com.example.demo.model.entity.Noticia;
import com.example.demo.model.entity.dto.NoticiaDTO;
import com.example.demo.repositories.mongo.NoticiaRepository;
import com.example.demo.services.service.NoticiaService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NoticiaServiceImpl implements NoticiaService {
    @Autowired
    private NoticiaRepository noticiaRepository;

    private static final String UPLOAD_DIR = "/upload/"; // Directory to store files

    @Override
public Noticia crearNoticia(NoticiaDTO noticiaDTO) {
    Noticia noticia = new Noticia();
    noticia.setTitulo(noticiaDTO.getTitulo());
    noticia.setContenido(noticiaDTO.getContenido());
    noticia.setFechaCreacion(new Date());
    noticia.setLikesCount(0);
    noticia.setLikedBy(new ArrayList<>());
    noticia.setComentarios(new ArrayList<>());

    // Save image to filesystem
    if (noticiaDTO.getImagen() != null && !noticiaDTO.getImagen().isEmpty()) {
        String fileName = UUID.randomUUID() + "_" + noticiaDTO.getImagen().getOriginalFilename();
        String filePath = saveFile(noticiaDTO.getImagen(), fileName);
        noticia.setImagenPath(filePath);
    }

    // Save video to filesystem (optional)
    if (noticiaDTO.getVideo() != null && !noticiaDTO.getVideo().isEmpty()) {
        String fileName = UUID.randomUUID() + "_" + noticiaDTO.getVideo().getOriginalFilename();
        String filePath = saveFile(noticiaDTO.getVideo(), fileName);
        noticia.setVideoPath(filePath);
    }

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

            // Update image if provided
            if (noticiaDTO.getImagen() != null && !noticiaDTO.getImagen().isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + noticiaDTO.getImagen().getOriginalFilename();
                String filePath = saveFile(noticiaDTO.getImagen(), fileName);
                noticia.setImagenPath(filePath);
            }

            // Update video if provided
            if (noticiaDTO.getVideo() != null && !noticiaDTO.getVideo().isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + noticiaDTO.getVideo().getOriginalFilename();
                String filePath = saveFile(noticiaDTO.getVideo(), fileName);
                noticia.setVideoPath(filePath);
            }

            return noticiaRepository.save(noticia);
        }
        return null;
    }

    @Override
    public void eliminarNoticia(String id) {
        Noticia noticia = noticiaRepository.findById(id).orElse(null);
        if (noticia != null) {
            // Optionally delete files from filesystem
            deleteFile(noticia.getImagenPath());
            deleteFile(noticia.getVideoPath());
            noticiaRepository.deleteById(id);
        }
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
            if (!noticia.getLikedBy().contains(username)) {
                noticia.setLikesCount(noticia.getLikesCount() + 1);
                noticia.getLikedBy().add(username);
                return noticiaRepository.save(noticia);
            }
            return noticia;
        }
        return null;
    }

    private String saveFile(MultipartFile file, String fileName) {
        try {
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
            }
            Path filePath = Paths.get(UPLOAD_DIR, fileName);
            Files.write(filePath, file.getBytes());
            return filePath.toString();
        } catch (IOException e) {
            throw new RuntimeException("Error saving file: " + fileName, e);
        }
    }
    // Helper method to delete files
    private void deleteFile(String filePath) {
        if (filePath != null) {
            try {
                Files.deleteIfExists(Paths.get(filePath));
            } catch (IOException e) {
                throw new RuntimeException("Error deleting file: " + filePath, e);
            }
        }
    }
}