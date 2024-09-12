package com.example.demo.controller;

import com.example.demo.model.entities.Curso;
import com.example.demo.services.CursoService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cursos")
@CrossOrigin(origins = "http://localhost:4200")
public class CursoController {

    private final CursoService cursoService;

    
    public CursoController(CursoService cursoService) {
        this.cursoService = cursoService;
    }

    @PostMapping(value = "/create")
    public ResponseEntity<Curso> createCurso(@Valid  @RequestBody Curso curso) {
        Curso savedCurso = cursoService.saveCurso(curso);
        return ResponseEntity.ok(savedCurso);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Curso> getCursoById(@PathVariable Long id) {
        Optional<Curso> curso = cursoService.getCursoById(id);
        return curso.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Curso>> getAllCursos() {
        List<Curso> cursos = cursoService.getAllCursos();
        return ResponseEntity.ok(cursos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Curso> updateCurso(@PathVariable Long id, @RequestBody Curso curso) {
        curso.setId(id);
        Curso updatedCurso = cursoService.updateCurso(curso);
        return ResponseEntity.ok(updatedCurso);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCurso(@PathVariable Long id) {
        cursoService.deleteCurso(id);
        return ResponseEntity.noContent().build();
    }
}