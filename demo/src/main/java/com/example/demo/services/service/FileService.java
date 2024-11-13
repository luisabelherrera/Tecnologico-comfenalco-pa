package com.example.demo.services.service;


import com.example.demo.model.entity.FileEntity;
import com.example.demo.response.ResponseFile;
import org.bson.types.ObjectId;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface FileService {
    // Permite almacenar o cargar archivos a la base de datos
    FileEntity store(MultipartFile file) throws IOException;

    // Permite descargar archivos de nuestra base de datos
    Optional<FileEntity> getFile (ObjectId id) throws FileNotFoundException;

    // Permite consultar la lista de archivos cargados a nuestra base de datos
    List<ResponseFile> getAllFiles();
}