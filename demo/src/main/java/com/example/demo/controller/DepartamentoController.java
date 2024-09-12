package com.example.demo.controller;

import com.example.demo.exceptions.DepartamentoInUseException;
import com.example.demo.model.entities.Departamento;
import com.example.demo.services.DepartamentoService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/departamentos")
public class DepartamentoController {

    private final DepartamentoService departamentoService;

    public DepartamentoController(DepartamentoService departamentoService) {
        this.departamentoService = departamentoService;
    }

    @PostMapping
    public ResponseEntity<Departamento> createDepartamento(@RequestBody Departamento departamento) {
        Departamento savedDepartamento = departamentoService.saveDepartamento(departamento);
        return ResponseEntity.ok(savedDepartamento);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Departamento> getDepartamentoById(@PathVariable Long id) {
        Optional<Departamento> departamento = departamentoService.getDepartamentoById(id);
        return departamento.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Departamento>> getAllDepartamentos() {
        List<Departamento> departamentos = departamentoService.getAllDepartamentos();
        return ResponseEntity.ok(departamentos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Departamento> updateDepartamento(@PathVariable Long id,
            @RequestBody Departamento departamento) {
        departamento.setId(id);
        Departamento updatedDepartamento = departamentoService.updateDepartamento(departamento);
        return ResponseEntity.ok(updatedDepartamento);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartamento(@PathVariable Long id) {
        try {
            departamentoService.deleteDepartamento(id);
            return ResponseEntity.noContent().build();
        } catch (DepartamentoInUseException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }
}