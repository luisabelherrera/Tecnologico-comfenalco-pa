package com.example.demo.controller.traspaso;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.entity.NivelDetalleCurso;
import com.example.demo.services.service.NivelDetalleCursoService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/nivel-detalle-curso")
public class NivelDetalleCursoController {

    @Autowired
    private NivelDetalleCursoService nivelDetalleCursoService;

    // Obtener todos los niveles de detalle de curso
    @GetMapping
    public ResponseEntity<List<NivelDetalleCurso>> getAllNivelDetalleCursos() {
        List<NivelDetalleCurso> nivelDetalleCursos = nivelDetalleCursoService.findAll();
        return ResponseEntity.ok(nivelDetalleCursos);
    }

    // Obtener un nivel de detalle de curso por ID
    @GetMapping("/{id}")
    public ResponseEntity<NivelDetalleCurso> getNivelDetalleCursoById(@PathVariable Integer id) {
        Optional<NivelDetalleCurso> nivelDetalleCurso = nivelDetalleCursoService.findById(id);
        return nivelDetalleCurso.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Crear un nuevo nivel de detalle de curso
    @PostMapping
    public ResponseEntity<NivelDetalleCurso> createNivelDetalleCurso(@RequestBody NivelDetalleCurso nivelDetalleCurso) {
        NivelDetalleCurso nuevoNivelDetalleCurso = nivelDetalleCursoService.save(nivelDetalleCurso);
        return ResponseEntity.ok(nuevoNivelDetalleCurso);
    }

    // Actualizar un nivel de detalle de curso existente
    @PutMapping("/{id}")
    public ResponseEntity<NivelDetalleCurso> updateNivelDetalleCurso(@PathVariable Integer id,
            @RequestBody NivelDetalleCurso nivelDetalleCursoDetalles) {
        Optional<NivelDetalleCurso> nivelDetalleCursoExistente = nivelDetalleCursoService.findById(id);
        if (nivelDetalleCursoExistente.isPresent()) {
            NivelDetalleCurso nivelDetalleCurso = nivelDetalleCursoExistente.get();
            nivelDetalleCurso.setActivo(nivelDetalleCursoDetalles.isActivo());
            NivelDetalleCurso nivelDetalleCursoActualizado = nivelDetalleCursoService.save(nivelDetalleCurso);
            return ResponseEntity.ok(nivelDetalleCursoActualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar un nivel de detalle de curso por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNivelDetalleCurso(@PathVariable Integer id) {
        Optional<NivelDetalleCurso> nivelDetalleCurso = nivelDetalleCursoService.findById(id);
        if (nivelDetalleCurso.isPresent()) {
            nivelDetalleCursoService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}