package com.example.demo.controller.entityController;

import com.example.demo.model.entity.EncuestaEstudiante;
import com.example.demo.services.service.EncuestaEstudianteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/encuestas")
@RequiredArgsConstructor
public class EncuestaEstudianteController {

    private final EncuestaEstudianteService encuestaService;

    // Crear encuesta
    @PostMapping
    public ResponseEntity<EncuestaEstudiante> crearEncuesta(@RequestBody EncuestaEstudiante encuesta) {
        System.out.println("Encuesta recibida para crear: " + encuesta); // Depuración
        if (encuesta.getEstudiante() == null || encuesta.getEstudiante().getIdEstudiante() == null) {
            System.out.println("Error: estudiante o estudiante_id es nulo");
            return ResponseEntity.badRequest().body(null); // Rechaza si no hay estudiante
        }
        EncuestaEstudiante saved = encuestaService.guardarEncuesta(encuesta);
        System.out.println("Encuesta guardada: " + saved); // Depuración
        return ResponseEntity.ok(saved);
    }

    // Obtener encuesta por ID
    @GetMapping("/{id}")
    public ResponseEntity<EncuestaEstudiante> obtenerPorId(@PathVariable Long id) {
        return encuestaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Obtener encuesta por ID del estudiante
    @GetMapping("/estudiante/{estudianteId}")
    public ResponseEntity<EncuestaEstudiante> obtenerPorEstudianteId(@PathVariable Integer estudianteId) {
        System.out.println("Buscando encuesta para estudiante_id: " + estudianteId); // Depuración
        return encuestaService.obtenerPorEstudianteId(estudianteId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Listar todas las encuestas
    @GetMapping
    public ResponseEntity<List<EncuestaEstudiante>> listarTodas() {
        List<EncuestaEstudiante> encuestas = encuestaService.listarTodas();
        System.out.println("Encuestas listadas: " + encuestas.size()); // Depuración
        return ResponseEntity.ok(encuestas);
    }

    // Actualizar encuesta
    @PutMapping("/{id}")
    public ResponseEntity<EncuestaEstudiante> actualizarEncuesta(@PathVariable Long id,
                                                                 @RequestBody EncuestaEstudiante encuesta) {
        System.out.println("Encuesta recibida para actualizar (ID: " + id + "): " + encuesta); // Depuración
        if (encuesta.getEstudiante() == null || encuesta.getEstudiante().getIdEstudiante() == null) {
            System.out.println("Error: estudiante o estudiante_id es nulo en actualización");
            return ResponseEntity.badRequest().body(null); // Rechaza si no hay estudiante
        }
        try {
            EncuestaEstudiante updated = encuestaService.actualizarEncuesta(id, encuesta);
            System.out.println("Encuesta actualizada: " + updated); // Depuración
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            System.out.println("Error al actualizar encuesta: " + e.getMessage()); // Depuración
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar encuesta
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEncuesta(@PathVariable Long id) {
        System.out.println("Eliminando encuesta con ID: " + id); // Depuración
        encuestaService.eliminarEncuesta(id);
        return ResponseEntity.noContent().build();
    }
}