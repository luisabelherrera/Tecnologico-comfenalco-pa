package com.example.demo.controller.entityController;

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
import org.springframework.web.bind.annotation.CrossOrigin;
import com.example.demo.model.entity.GradoSeccion;
import com.example.demo.services.service.GradoSeccionService;

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
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<GradoSeccion> createGradoSeccion(@RequestBody GradoSeccion gradoSeccion) {
        GradoSeccion nuevoGradoSeccion = gradoSeccionService.save(gradoSeccion);
        return ResponseEntity.ok(nuevoGradoSeccion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GradoSeccion> updateGradoSeccion(@PathVariable Integer id,

            @RequestBody GradoSeccion gradoSeccionDetalles) {
        Optional<GradoSeccion> gradoSeccionExistente = gradoSeccionService.findById(id);
        if (gradoSeccionExistente.isPresent()) {
            GradoSeccion gradoSeccion = gradoSeccionExistente.get();

            gradoSeccion.setDescripcionGrado(gradoSeccionDetalles.getDescripcionGrado());
            gradoSeccion.setDescripcionSeccion(gradoSeccionDetalles.getDescripcionSeccion());
            gradoSeccion.setActivo(gradoSeccionDetalles.isActivo());
            GradoSeccion gradoSeccionActualizado = gradoSeccionService.save(gradoSeccion);
            return ResponseEntity.ok(gradoSeccionActualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGradoSeccion(@PathVariable Integer id) {
        Optional<GradoSeccion> gradoSeccion = gradoSeccionService.findById(id);
        if (gradoSeccion.isPresent()) {
            gradoSeccionService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
