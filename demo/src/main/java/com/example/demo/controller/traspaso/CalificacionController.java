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

import com.example.demo.model.entity.Calificacion;
import com.example.demo.services.service.CalificacionService;

@RestController
@RequestMapping("/api/calificaciones")
public class CalificacionController {

    @Autowired
    private CalificacionService calificacionService;

    @GetMapping
    public ResponseEntity<List<Calificacion>> getAllCalificaciones() {
        List<Calificacion> calificaciones = calificacionService.findAll();
        return ResponseEntity.ok(calificaciones);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Calificacion> getCalificacionById(@PathVariable Integer id) {
        Optional<Calificacion> calificacion = calificacionService.findById(id);
        if (calificacion.isPresent()) {
            return ResponseEntity.ok(calificacion.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Calificacion> createCalificacion(@RequestBody Calificacion calificacion) {
        Calificacion nuevaCalificacion = calificacionService.save(calificacion);
        return ResponseEntity.ok(nuevaCalificacion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Calificacion> updateCalificacion(@PathVariable Integer id,
            @RequestBody Calificacion calificacionDetalles) {
        Optional<Calificacion> calificacionExistente = calificacionService.findById(id);
        if (calificacionExistente.isPresent()) {
            Calificacion calificacion = calificacionExistente.get();

            calificacion.setNota(calificacionDetalles.getNota());
            Calificacion calificacionActualizada = calificacionService.save(calificacion);
            return ResponseEntity.ok(calificacionActualizada);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCalificacion(@PathVariable Integer id) {
        Optional<Calificacion> calificacion = calificacionService.findById(id);
        if (calificacion.isPresent()) {
            calificacionService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
