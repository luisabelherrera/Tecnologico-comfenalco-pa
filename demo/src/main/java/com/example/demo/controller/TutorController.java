package com.example.demo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.entities.Tutor;
import com.example.demo.services.TutorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tutores")
@CrossOrigin(origins = "http://localhost:4200")
public class TutorController {

    private final TutorService tutorService;

    public TutorController(TutorService tutorService) {
        this.tutorService = tutorService;
    }

    @PostMapping(value = "/create")
    public ResponseEntity<Tutor> createTutor(@Valid @RequestBody Tutor tutor) {
        Tutor savedTutor = tutorService.saveTutor(tutor);
        return ResponseEntity.ok(savedTutor);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tutor> getTutorById(@PathVariable Long id) {
        Optional<Tutor> tutor = tutorService.getTutorById(id);
        return tutor.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Tutor>> getAllTutores() {
        List<Tutor> tutores = tutorService.getAllTutores();
        return ResponseEntity.ok(tutores);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tutor> updateTutor(@PathVariable Long id, @RequestBody Tutor tutor) {
        tutor.setId(id);
        Tutor updatedTutor = tutorService.updateTutor(tutor);
        return ResponseEntity.ok(updatedTutor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTutor(@PathVariable Long id) {
        tutorService.deleteTutor(id);
        return ResponseEntity.noContent().build();
    }
}
