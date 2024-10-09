package com.example.demo.controller.traspaso;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.entity.Curso;
import com.example.demo.services.service.CursoService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cursos")
public class CursoController {

    @Autowired
    private CursoService cursoService;

    @GetMapping
    public ResponseEntity<List<Curso>> getAllCursos() {
        List<Curso> cursos = cursoService.findAll();
        return ResponseEntity.ok(cursos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Curso> getCursoById(@PathVariable Integer id) {
        Optional<Curso> curso = cursoService.findById(id);
        if (curso.isPresent()) {
            return ResponseEntity.ok(curso.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Curso> createCurso(@RequestBody Curso curso) {
        Curso nuevoCurso = cursoService.save(curso);
        return ResponseEntity.ok(nuevoCurso);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Curso> updateCurso(@PathVariable Integer id, @RequestBody Curso cursoDetalles) {
        Optional<Curso> cursoExistente = cursoService.findById(id);
        if (cursoExistente.isPresent()) {
            Curso curso = cursoExistente.get();

            curso.setDescripcion(cursoDetalles.getDescripcion());
            curso.setActivo(cursoDetalles.isActivo());
            Curso cursoActualizado = cursoService.save(curso);
            return ResponseEntity.ok(cursoActualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar un curso por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCurso(@PathVariable Integer id) {
        Optional<Curso> curso = cursoService.findById(id);
        if (curso.isPresent()) {
            cursoService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
