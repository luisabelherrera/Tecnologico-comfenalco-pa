package com.example.demo.controller;

import com.example.demo.model.entities.Profesor;
import com.example.demo.services.ProfesorService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/profesores")
public class ProfesorController {

    private final ProfesorService profesorService;

 
    public ProfesorController(ProfesorService profesorService) {
        this.profesorService = profesorService;
    }

    @PostMapping
    public ResponseEntity<Profesor> createProfesor(@RequestBody Profesor profesor) {
        Profesor savedProfesor = profesorService.saveProfesor(profesor);
        return ResponseEntity.ok(savedProfesor);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profesor> getProfesorById(@PathVariable Long id) {
        Optional<Profesor> profesor = profesorService.getProfesorById(id);
        return profesor.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Profesor>> getAllProfesores() {
        List<Profesor> profesores = profesorService.getAllProfesores();
        return ResponseEntity.ok(profesores);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Profesor> updateProfesor(@PathVariable Long id, @RequestBody Profesor profesor) {
        profesor.setId(id);
        Profesor updatedProfesor = profesorService.updateProfesor(profesor);
        return ResponseEntity.ok(updatedProfesor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfesor(@PathVariable Long id) {
        profesorService.deleteProfesor(id);
        return ResponseEntity.noContent().build();
    }
}