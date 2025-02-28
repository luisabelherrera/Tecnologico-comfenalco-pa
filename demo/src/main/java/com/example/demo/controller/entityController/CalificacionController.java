package com.example.demo.controller.entityController;

import com.example.demo.model.entity.Calificacion;
import com.example.demo.services.service.CalificacionService;
import com.example.demo.services.service.impl.CalificacionServiceImpl;
import com.example.demo.exceptions.customexceptions.exceptionsEntity.CalificacionNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api/calificaciones")
public class CalificacionController {

    @Autowired
    private CalificacionService calificacionService;



    @Autowired
    private     CalificacionServiceImpl calificacionServiceImpl;
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
            throw new CalificacionNotFoundException(id);
        }
    }
    @PostMapping
    public ResponseEntity<Calificacion> createCalificacion(@RequestBody Calificacion calificacion) {
        Calificacion nuevaCalificacion = calificacionService.save(calificacion);
        return ResponseEntity.ok(nuevaCalificacion);
    }
    @GetMapping("/docente/{idDocente}")
    public ResponseEntity<List<Calificacion>> getCalificacionesByDocente(@PathVariable Integer idDocente) {
        List<Calificacion> calificaciones = calificacionServiceImpl.findByDocenteId(idDocente);
        return ResponseEntity.ok(calificaciones);
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
            throw new CalificacionNotFoundException(id);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCalificacion(@PathVariable Integer id) {
        Optional<Calificacion> calificacion = calificacionService.findById(id);
        if (calificacion.isPresent()) {
            calificacionService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            throw new CalificacionNotFoundException(id);
        }
    }
}
