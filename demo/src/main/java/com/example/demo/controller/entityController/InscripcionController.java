package com.example.demo.controller.entityController;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import com.example.demo.model.entity.Inscripcion;
import com.example.demo.services.service.InscripcionService;

@CrossOrigin
@RestController
@RequestMapping("/api/inscripciones")
public class InscripcionController {

    @Autowired
    private InscripcionService inscripcionService;

    @GetMapping
    public ResponseEntity<List<Inscripcion>> getAllInscripciones() {
        List<Inscripcion> inscripciones = inscripcionService.findAll();
        return ResponseEntity.ok(inscripciones);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inscripcion> getInscripcionById(@PathVariable Integer id) {
        Optional<Inscripcion> inscripcion = inscripcionService.findById(id);
        return inscripcion.map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping
    public ResponseEntity<?> createInscripcion(@RequestBody Inscripcion inscripcion) {
        if (inscripcion.getAcudiente() == null) {
            return ResponseEntity.badRequest().body("El acudiente no puede ser nulo.");
        }

        try {
            Inscripcion savedInscripcion = inscripcionService.save(inscripcion);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedInscripcion);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateInscripcion(@PathVariable Integer id, @RequestBody Inscripcion inscripcion) {
        Optional<Inscripcion> existingInscripcion = inscripcionService.findById(id);
        if (!existingInscripcion.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Inscripción no encontrada.");
        }

        inscripcion.setIdInscripcion(id);

        try {
            Inscripcion updatedInscripcion = inscripcionService.save(inscripcion);
            return ResponseEntity.ok(updatedInscripcion);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInscripcion(@PathVariable Integer id) {
        Optional<Inscripcion> inscripcion = inscripcionService.findById(id);
        if (!inscripcion.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Inscripción no encontrada.");
        }

        try {
            inscripcionService.deleteById(id);
            return ResponseEntity.noContent().build(); // Devuelve 204 No Content si se eliminó exitosamente
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar la inscripción.");
        }
    }
}
