package com.example.demo.services.service;

import com.example.demo.model.entity.PrecioNivelEducativo;
import com.example.demo.repositories.mongo.PrecioNivelEducativoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PrecioNivelEducativoService {

    @Autowired
    private PrecioNivelEducativoRepository repository;

    private static final String UPLOAD_DIR = "/upload/";

    public List<PrecioNivelEducativo> findAll() {
        return repository.findAll();
    }

    public Optional<PrecioNivelEducativo> findById(String id) {
        return repository.findById(id);
    }

    public PrecioNivelEducativo save(PrecioNivelEducativo precio) {
        return repository.save(precio);
    }

    public PrecioNivelEducativo saveWithImage(PrecioNivelEducativo precio, MultipartFile imagen) {
        if (imagen != null && !imagen.isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + imagen.getOriginalFilename();
            String filePath = saveFile(imagen, fileName);
            precio.setImagenPath(filePath);
        }
        return repository.save(precio);
    }

    public void deleteById(String id) {
        Optional<PrecioNivelEducativo> precioOpt = repository.findById(id);
        if (precioOpt.isPresent()) {
            PrecioNivelEducativo precio = precioOpt.get();
            deleteFile(precio.getImagenPath());
            repository.deleteById(id);
        }
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