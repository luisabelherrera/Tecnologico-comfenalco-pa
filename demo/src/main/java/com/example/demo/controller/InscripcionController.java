package com.example.demo.controller;

import com.example.demo.model.entities.Inscripcion;
import com.example.demo.services.InscripcionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/inscripciones")
public class InscripcionController {

    private final InscripcionService inscripcionService;


    public InscripcionController(InscripcionService inscripcionService) {
        this.inscripcionService = inscripcionService;
    }

    @PostMapping
    public ResponseEntity<Inscripcion> createInscripcion(@RequestBody Inscripcion inscripcion) {
        Inscripcion savedInscripcion = inscripcionService.saveInscripcion(inscripcion);
        return ResponseEntity.ok(savedInscripcion);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inscripcion> getInscripcionById(@PathVariable Long id) {
        Optional<Inscripcion> inscripcion = inscripcionService.getInscripcionById(id);
        return inscripcion.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Inscripcion>> getAllInscripciones() {
        List<Inscripcion> inscripciones = inscripcionService.getAllInscripciones();
        return ResponseEntity.ok(inscripciones);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inscripcion> updateInscripcion(@PathVariable Long id, @RequestBody Inscripcion inscripcion) {
        inscripcion.setId(id);
        Inscripcion updatedInscripcion = inscripcionService.updateInscripcion(inscripcion);
        return ResponseEntity.ok(updatedInscripcion);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInscripcion(@PathVariable Long id) {
        inscripcionService.deleteInscripcion(id);
        return ResponseEntity.noContent().build();
    }
}