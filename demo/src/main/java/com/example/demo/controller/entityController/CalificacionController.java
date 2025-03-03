package com.example.demo.controller.entityController;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.entity.Calificacion;
import com.example.demo.services.service.CalificacionService;

@RestController
@RequestMapping("/api/calificaciones")
public class CalificacionController {

    @Autowired
    private CalificacionService calificacionService;

    // Obtener todas las calificaciones
    @GetMapping
    public ResponseEntity<List<Calificacion>> getAllCalificaciones() {
        List<Calificacion> calificaciones = calificacionService.findAll();
        return new ResponseEntity<>(calificaciones, HttpStatus.OK);
    }

    // Obtener una calificación por ID
    @GetMapping("/{id}")
    public ResponseEntity<Calificacion> getCalificacionById(@PathVariable Integer id) {
        Optional<Calificacion> calificacion = calificacionService.findById(id);
        return calificacion.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Obtener calificaciones por docente
    @GetMapping("/docente/{idDocente}")
    public ResponseEntity<List<Calificacion>> getCalificacionesByDocente(@PathVariable Integer idDocente) {
        List<Calificacion> calificaciones = calificacionService.findByDocenteId(idDocente);
        return new ResponseEntity<>(calificaciones, HttpStatus.OK);
    }

    // Obtener calificaciones por curricular
    @GetMapping("/curricular/{idCurricular}")
    public ResponseEntity<List<Calificacion>> getCalificacionesByCurricular(@PathVariable Integer idCurricular) {
        List<Calificacion> calificaciones = calificacionService.findByCurricularId(idCurricular);
        return new ResponseEntity<>(calificaciones, HttpStatus.OK);
    }
    // Crear una nueva calificación
    @PostMapping
    public ResponseEntity<Calificacion> createCalificacion(@RequestBody Calificacion calificacion) {
        // Asegurarse de que el ID no esté presente (se genera automáticamente)
        if (calificacion.getIdCalificacion() != null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Evitar pasar un ID en creación
        }
        Calificacion savedCalificacion = calificacionService.save(calificacion);
        return new ResponseEntity<>(savedCalificacion, HttpStatus.CREATED);
    }

    // Actualizar una calificación existente
    @PutMapping("/{id}")
    public ResponseEntity<Calificacion> updateCalificacion(@PathVariable Integer id, @RequestBody Calificacion calificacion) {
        Optional<Calificacion> existingCalificacion = calificacionService.findById(id);
        if (existingCalificacion.isPresent()) {
            calificacion.setIdCalificacion(id); // Asegurar que el ID coincida
            Calificacion updatedCalificacion = calificacionService.save(calificacion);
            return new ResponseEntity<>(updatedCalificacion, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Eliminar una calificación
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCalificacion(@PathVariable Integer id) {
        Optional<Calificacion> calificacion = calificacionService.findById(id);
        if (calificacion.isPresent()) {
            calificacionService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}