package com.example.demo.services.service.impl;

import com.example.demo.model.entity.FileEntity;
import com.example.demo.repositories.mongo.FileRepository;
import com.example.demo.response.ResponseFile;
import com.example.demo.services.service.FileService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FileServiceImpl implements FileService {

    @Autowired
    private FileRepository fileRepository;

    @Override
    public FileEntity store(MultipartFile file) throws IOException {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        FileEntity fileEntity = FileEntity.builder()
                .id(ObjectId.get()) // Genera un nuevo ObjectId
                .nombre(fileName)
                .tipo(file.getContentType())
                .datos(file.getBytes())
                .build();
        return fileRepository.save(fileEntity);
    }

    @Override
    public Optional<FileEntity> getFile(ObjectId id) throws FileNotFoundException {
        Optional<FileEntity> file = fileRepository.findById(id);
        if (file.isPresent()) {
            return file;
        }
        throw new FileNotFoundException("Archivo no encontrado");
    }

    @Override
    public List<ResponseFile> getAllFiles() {
        return fileRepository.findAll().stream().map(dbFile -> {
            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/api/fileManager/files/")
                    .path(dbFile.getId().toString())
                    .toUriString();
            return ResponseFile.builder()
                    .name(dbFile.getNombre())
                    .url(fileDownloadUri)
                    .type(dbFile.getTipo())
                    .size(dbFile.getDatos().length)
                    .build();
        }).collect(Collectors.toList());
    }
}