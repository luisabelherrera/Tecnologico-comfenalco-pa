package com.example.demo.controller;

import com.example.demo.model.entities.Aula;
import com.example.demo.services.AulaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/aulas")
@CrossOrigin(origins = "http://localhost:4200")
public class AulaController {

    private final AulaService aulaService;

 
    public AulaController(AulaService aulaService) {
        this.aulaService = aulaService;
    }

    @PostMapping
    public ResponseEntity<Aula> createAula(@RequestBody Aula aula) {
        Aula savedAula = aulaService.saveAula(aula);
        return ResponseEntity.ok(savedAula);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Aula> getAulaById(@PathVariable Long id) {
        Optional<Aula> aula = aulaService.getAulaById(id);
        return aula.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Aula>> getAllAulas() {
        List<Aula> aulas = aulaService.getAllAulas();
        return ResponseEntity.ok(aulas);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Aula> updateAula(@PathVariable Long id, @RequestBody Aula aula) {
        aula.setId(id);
        Aula updatedAula = aulaService.updateAula(aula);
        return ResponseEntity.ok(updatedAula);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAula(@PathVariable Long id) {
        try {
            aulaService.deleteAula(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}