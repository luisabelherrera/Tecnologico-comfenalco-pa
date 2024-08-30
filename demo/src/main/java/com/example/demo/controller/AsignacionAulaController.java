package com.example.demo.controller;

import com.example.demo.model.entities.AsignacionAula;
import com.example.demo.services.AsignacionAulaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/asignaciones-aulas")
@CrossOrigin(origins = "http://localhost:4200")
public class AsignacionAulaController {

    private final AsignacionAulaService asignacionAulaService;

  
  
    public AsignacionAulaController(AsignacionAulaService asignacionAulaService) {
        this.asignacionAulaService = asignacionAulaService;
    }


    
    /**
     * @param asignacionAula
     * 
     * 1 Prueba
     * @return
     */
    @PostMapping
    public ResponseEntity<AsignacionAula> createAsignacionAula(@RequestBody AsignacionAula asignacionAula) {
        AsignacionAula savedAsignacionAula = asignacionAulaService.saveAsignacionAula(asignacionAula);
        return ResponseEntity.ok(savedAsignacionAula);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AsignacionAula> getAsignacionAulaById(@PathVariable Long id) {
        Optional<AsignacionAula> asignacionAula = asignacionAulaService.getAsignacionAulaById(id);
        return asignacionAula.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<AsignacionAula>> getAllAsignacionesAulas() {
        List<AsignacionAula> asignacionesAulas = asignacionAulaService.getAllAsignacionesAulas();
        return ResponseEntity.ok(asignacionesAulas);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AsignacionAula> updateAsignacionAula(@PathVariable Long id, @RequestBody AsignacionAula asignacionAula) {
        asignacionAula.setId(id);
        AsignacionAula updatedAsignacionAula = asignacionAulaService.updateAsignacionAula(asignacionAula);
        return ResponseEntity.ok(updatedAsignacionAula);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAsignacionAula(@PathVariable Long id) {
        asignacionAulaService.deleteAsignacionAula(id);
        return ResponseEntity.noContent().build();
    }
}