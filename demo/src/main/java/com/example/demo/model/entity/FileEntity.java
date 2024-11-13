package com.example.demo.model.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.bson.types.ObjectId;

import java.io.Serializable;

@Document(collection = "archivos")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FileEntity implements Serializable {

    @Id
    private ObjectId id;
    private String nombre;
    private String tipo;
    private byte[] datos;
}