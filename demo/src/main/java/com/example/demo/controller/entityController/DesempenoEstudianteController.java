package com.example.demo.controller.entityController;

import com.example.demo.model.entity.DesempenoEstudiante;
import com.example.demo.services.service.DesempenoEstudianteService; // Ajusta el paquete
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/prediccion")
public class DesempenoEstudianteController {

    @Autowired
    private DesempenoEstudianteService service;

    @PostMapping
    public ResponseEntity<DesempenoEstudiante> create(@RequestBody DesempenoEstudiante desempenoEstudiante) {
        DesempenoEstudiante saved = service.save(desempenoEstudiante);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DesempenoEstudiante> getById(@PathVariable Integer id) {
        Optional<DesempenoEstudiante> desempeno = service.findById(id);
        return desempeno.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<DesempenoEstudiante>> getAll() {
        List<DesempenoEstudiante> desempenos = service.findAll();
        return ResponseEntity.ok(desempenos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DesempenoEstudiante> update(@PathVariable Integer id, 
                                                      @RequestBody DesempenoEstudiante desempenoEstudiante) {
        try {
            DesempenoEstudiante updated = service.update(id, desempenoEstudiante);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        try {
            service.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}