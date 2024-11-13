package com.example.demo.controller.entityController;



import com.example.demo.exceptions.customexceptions.exceptionsEntity.FileControllerException;
import com.example.demo.exceptions.messages.ErrorMessages;
import com.example.demo.model.entity.FileEntity;
import com.example.demo.response.ResponseFile;
import com.example.demo.response.ResponseMessage;
import com.example.demo.services.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.bson.types.ObjectId;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/fileManager")
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<ResponseMessage> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            fileService.store(file);
            return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage("Archivo subido exitosamente"));
        } catch (IOException e) {
            throw new FileControllerException(ErrorMessages.FILE_UPLOAD_ERROR, e);
        }
    }

    @GetMapping("/files/{id}")
    public ResponseEntity<byte[]> getFile(@PathVariable String id) {
        try {
            ObjectId objectId = new ObjectId(id);
            FileEntity fileEntity = fileService.getFile(objectId)
                    .orElseThrow(() -> new FileControllerException(ErrorMessages.FILE_NOT_FOUND + " con ID: " + id));
            return ResponseEntity.status(HttpStatus.OK)
                    .header(HttpHeaders.CONTENT_TYPE, fileEntity.getTipo())
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileEntity.getNombre() + "\"")
                    .body(fileEntity.getDatos());
        } catch (FileNotFoundException e) {
            throw new FileControllerException(ErrorMessages.FILE_NOT_FOUND + " con ID: " + id, e);
        }
    }

    @GetMapping("/files")
    public ResponseEntity<List<ResponseFile>> getListFiles() {
        try {
            List<ResponseFile> files = fileService.getAllFiles();
            return ResponseEntity.status(HttpStatus.OK).body(files);
        } catch (Exception e) {
            throw new FileControllerException("Error al obtener la lista de archivos", e);
        }
    }
}
