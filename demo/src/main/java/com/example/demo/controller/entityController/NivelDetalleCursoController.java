package com.example.demo.controller.entityController;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.entity.NivelDetalleCurso;
import com.example.demo.services.service.NivelDetalleCursoService;
import com.example.demo.exceptions.customexceptions.exceptionsEntity.NivelDetalleCursoException;

@CrossOrigin
@RestController
@RequestMapping("/api/nivel-detalle-curso")
public class NivelDetalleCursoController {

    @Autowired
    private NivelDetalleCursoService nivelDetalleCursoService;

    @GetMapping
    public ResponseEntity<List<NivelDetalleCurso>> getAllNivelDetalleCursos() {
        List<NivelDetalleCurso> nivelDetalleCursos = nivelDetalleCursoService.findAll();
        return ResponseEntity.ok(nivelDetalleCursos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NivelDetalleCurso> getNivelDetalleCursoById(@PathVariable Integer id) {
        Optional<NivelDetalleCurso> nivelDetalleCurso = nivelDetalleCursoService.findById(id);
        if (nivelDetalleCurso.isEmpty()) {
            throw new NivelDetalleCursoException("NivelDetalleCurso no encontrado con id: " + id);
        }
        return ResponseEntity.ok(nivelDetalleCurso.get());
    }

    @PostMapping
    public ResponseEntity<NivelDetalleCurso> createNivelDetalleCurso(@RequestBody NivelDetalleCurso nivelDetalleCurso) {
        NivelDetalleCurso nuevoNivelDetalleCurso = nivelDetalleCursoService.save(nivelDetalleCurso);
        return ResponseEntity.ok(nuevoNivelDetalleCurso);
    }

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
            throw new NivelDetalleCursoException("NivelDetalleCurso no encontrado con id: " + id);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNivelDetalleCurso(@PathVariable Integer id) {
        Optional<NivelDetalleCurso> nivelDetalleCurso = nivelDetalleCursoService.findById(id);
        if (nivelDetalleCurso.isPresent()) {
            nivelDetalleCursoService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            throw new NivelDetalleCursoException("NivelDetalleCurso no encontrado con id: " + id);
        }
    }
}
