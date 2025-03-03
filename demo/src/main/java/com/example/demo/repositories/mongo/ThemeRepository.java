package com.example.demo.repositories.mongo;


import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.model.entity.Theme;

public interface ThemeRepository extends MongoRepository<Theme, String> {
    Optional<Theme> findByIsActiveTrue();
}