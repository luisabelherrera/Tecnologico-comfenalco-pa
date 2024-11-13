package com.example.demo.controller.entityController;

import com.example.demo.exceptions.customexceptions.exceptionsEntity.GradoSeccionException;
import com.example.demo.model.entity.GradoSeccion;
import com.example.demo.services.service.GradoSeccionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api/grado-seccion")
public class GradoSeccionController {

    @Autowired
    private GradoSeccionService gradoSeccionService;

    @GetMapping
    public ResponseEntity<List<GradoSeccion>> getAllGradoSeccion() {
        List<GradoSeccion> gradoSecciones = gradoSeccionService.findAll();
        return ResponseEntity.ok(gradoSecciones);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GradoSeccion> getGradoSeccionById(@PathVariable Integer id) {
        Optional<GradoSeccion> gradoSeccion = gradoSeccionService.findById(id);
        return gradoSeccion.map(ResponseEntity::ok)
                .orElseGet(() -> {
                    throw new GradoSeccionException("Grado y Sección no encontrado con ID: " + id);
                });
    }

    @PostMapping
    public ResponseEntity<GradoSeccion> createGradoSeccion(@RequestBody GradoSeccion gradoSeccion) {
        if (gradoSeccion == null || gradoSeccion.getDescripcionGrado() == null || gradoSeccion.getDescripcionSeccion() == null) {
            throw new GradoSeccionException("Los campos 'DescripcionGrado' y 'DescripcionSeccion' son obligatorios.");
        }
        GradoSeccion nuevoGradoSeccion = gradoSeccionService.save(gradoSeccion);
        return ResponseEntity.ok(nuevoGradoSeccion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GradoSeccion> updateGradoSeccion(@PathVariable Integer id, @RequestBody GradoSeccion gradoSeccionDetalles) {
        Optional<GradoSeccion> gradoSeccionExistente = gradoSeccionService.findById(id);
        if (gradoSeccionExistente.isPresent()) {
            GradoSeccion gradoSeccion = gradoSeccionExistente.get();
            gradoSeccion.setDescripcionGrado(gradoSeccionDetalles.getDescripcionGrado());
            gradoSeccion.setDescripcionSeccion(gradoSeccionDetalles.getDescripcionSeccion());
            gradoSeccion.setActivo(gradoSeccionDetalles.isActivo());
            GradoSeccion gradoSeccionActualizado = gradoSeccionService.save(gradoSeccion);
            return ResponseEntity.ok(gradoSeccionActualizado);
        } else {
            throw new GradoSeccionException("No se pudo encontrar GradoSección con ID: " + id);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGradoSeccion(@PathVariable Integer id) {
        Optional<GradoSeccion> gradoSeccion = gradoSeccionService.findById(id);
        if (gradoSeccion.isPresent()) {
            gradoSeccionService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            throw new GradoSeccionException("No se pudo eliminar GradoSección con ID: " + id);
        }
    }
}
