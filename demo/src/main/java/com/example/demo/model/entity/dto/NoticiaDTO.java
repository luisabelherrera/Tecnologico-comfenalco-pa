package com.example.demo.model.entity.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class NoticiaDTO {
    private String titulo;
    private String contenido;
    private MultipartFile imagen; // For uploading image
    private MultipartFile video; // For uploading video (optional)
    private String imagenPath;   // Path after saving
    private String videoPath;    // Path after saving (optional)
}