package com.example.demo.repositories.mongo;


import com.example.demo.model.entity.FileEntity;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FileRepository  extends MongoRepository<FileEntity, ObjectId> {
}