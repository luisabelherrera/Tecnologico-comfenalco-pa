package com.example.demo.controller.entityController;

import java.util.List;

import com.example.demo.exceptions.customexceptions.exceptionsEntity.PeriodoNotFoundException;
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
import org.springframework.web.bind.annotation.CrossOrigin;


import com.example.demo.model.entity.Periodo;
import com.example.demo.services.service.PeriodoService;

@CrossOrigin
@RestController
@RequestMapping("/api/periodo")
public class PeriodoController {

    @Autowired
    private PeriodoService periodoService;

    @GetMapping
    public ResponseEntity<List<Periodo>> getAllPeriodos() {
        List<Periodo> periodos = periodoService.findAll();
        return ResponseEntity.ok(periodos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Periodo> getPeriodoById(@PathVariable Integer id) {
        Periodo periodo = periodoService.findById(id)
                .orElseThrow(() -> new PeriodoNotFoundException("Periodo no encontrado con id: " + id));
        return ResponseEntity.ok(periodo);
    }

    @PostMapping
    public ResponseEntity<Periodo> createPeriodo(@RequestBody Periodo periodo) {
        Periodo nuevoPeriodo = periodoService.save(periodo);
        return ResponseEntity.ok(nuevoPeriodo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Periodo> updatePeriodo(@PathVariable Integer id, @RequestBody Periodo periodoDetalles) {
        Periodo periodoExistente = periodoService.findById(id)
                .orElseThrow(() -> new PeriodoNotFoundException("Periodo no encontrado con id: " + id));
        periodoExistente.setDescripcion(periodoDetalles.getDescripcion());
        periodoExistente.setFechaInicio(periodoDetalles.getFechaInicio());
        periodoExistente.setFechaFin(periodoDetalles.getFechaFin());
        periodoExistente.setActivo(periodoDetalles.isActivo());
        Periodo periodoActualizado = periodoService.save(periodoExistente);
        return ResponseEntity.ok(periodoActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePeriodo(@PathVariable Integer id) {
        Periodo periodo = periodoService.findById(id)
                .orElseThrow(() -> new PeriodoNotFoundException("Periodo no encontrado con id: " + id));
        periodoService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
