package com.example.demo.controller.traspaso;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.entity.Periodo;
import com.example.demo.services.service.PeriodoService;

@RestController
@RequestMapping("/api/periodo")
public class PeriodoController {

    @Autowired
    private PeriodoService periodoService;

    // Obtener todos los períodos
    @GetMapping
    public ResponseEntity<List<Periodo>> getAllPeriodos() {
        List<Periodo> periodos = periodoService.findAll();
        return ResponseEntity.ok(periodos);
    }

    // Obtener un período por ID
    @GetMapping("/{id}")
    public ResponseEntity<Periodo> getPeriodoById(@PathVariable Integer id) {
        Optional<Periodo> periodo = periodoService.findById(id);
        return periodo.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Crear un nuevo período
    @PostMapping
    public ResponseEntity<Periodo> createPeriodo(@RequestBody Periodo periodo) {
        Periodo nuevoPeriodo = periodoService.save(periodo);
        return ResponseEntity.ok(nuevoPeriodo);
    }

    // Actualizar un período existente
    @PutMapping("/{id}")
    public ResponseEntity<Periodo> updatePeriodo(@PathVariable Integer id, @RequestBody Periodo periodoDetalles) {
        Optional<Periodo> periodoExistente = periodoService.findById(id);
        if (periodoExistente.isPresent()) {
            Periodo periodo = periodoExistente.get();
            // Actualizar los campos necesarios
            periodo.setDescripcion(periodoDetalles.getDescripcion());
            periodo.setFechaInicio(periodoDetalles.getFechaInicio());
            periodo.setFechaFin(periodoDetalles.getFechaFin());
            periodo.setActivo(periodoDetalles.isActivo());
            Periodo periodoActualizado = periodoService.save(periodo);
            return ResponseEntity.ok(periodoActualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar un período por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePeriodo(@PathVariable Integer id) {
        Optional<Periodo> periodo = periodoService.findById(id);
        if (periodo.isPresent()) {
            periodoService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}