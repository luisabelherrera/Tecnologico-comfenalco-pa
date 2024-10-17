package com.example.demo.controller.entityController;

import java.time.LocalDateTime;
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

import com.example.demo.model.entity.Docente;
import com.example.demo.model.entity.DocenteNivelDetalleCurso;
import com.example.demo.model.entity.NivelDetalleCurso;
import com.example.demo.services.service.DocenteNivelDetalleCursoService;
import com.example.demo.services.service.DocenteService;
import com.example.demo.services.service.NivelDetalleCursoService;

@RestController
@RequestMapping("/api/docente-nivel-detalle-curso")
public class DocenteNivelDetalleCursoController {

    @Autowired
    private DocenteNivelDetalleCursoService docenteNivelDetalleCursoService;

    @Autowired
    private NivelDetalleCursoService nivelDetalleCursoService;

    @Autowired
    private DocenteService docenteService;

    @GetMapping
    public ResponseEntity<List<DocenteNivelDetalleCurso>> getAll() {
        List<DocenteNivelDetalleCurso> list = docenteNivelDetalleCursoService.findAll();
        return ResponseEntity.ok(list);
    }

    // Obtener un registro por ID
    @GetMapping("/{id}")
    public ResponseEntity<DocenteNivelDetalleCurso> getById(@PathVariable Integer id) {
        Optional<DocenteNivelDetalleCurso> result = docenteNivelDetalleCursoService.findById(id);
        return result.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crearDocenteNivelDetalleCurso(
            @RequestBody DocenteNivelDetalleCurso docenteNivelDetalleCurso) {
        Optional<NivelDetalleCurso> nivelDetalleCursoOptional = nivelDetalleCursoService
                .findById(docenteNivelDetalleCurso.getNivelDetalleCurso().getIdNivelDetalleCurso());
        Optional<Docente> docenteOptional = docenteService
                .findById(docenteNivelDetalleCurso.getDocente().getIdDocente());

        if (nivelDetalleCursoOptional.isPresent() && docenteOptional.isPresent()) {
            docenteNivelDetalleCurso.setNivelDetalleCurso(nivelDetalleCursoOptional.get());
            docenteNivelDetalleCurso.setDocente(docenteOptional.get());
            docenteNivelDetalleCurso.setFechaRegistro(LocalDateTime.now());

            DocenteNivelDetalleCurso nuevoRegistro = docenteNivelDetalleCursoService.save(docenteNivelDetalleCurso);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoRegistro);
        } else {
            String mensajeError = "Error: ";
            if (nivelDetalleCursoOptional.isEmpty()) {
                mensajeError += "NivelDetalleCurso no encontrado. ";
            }
            if (docenteOptional.isEmpty()) {
                mensajeError += "Docente no encontrado.";
            }
            return ResponseEntity.badRequest().body(mensajeError); // Ahora devuelve un String
        }
    }

    // Actualizar un registro existente
    @PutMapping("/{id}")
    public ResponseEntity<DocenteNivelDetalleCurso> update(@PathVariable Integer id,
            @RequestBody DocenteNivelDetalleCurso docenteNivelDetalleCursoDetails) {
        Optional<DocenteNivelDetalleCurso> existingDocenteNivelDetalleCurso = docenteNivelDetalleCursoService
                .findById(id);

        if (existingDocenteNivelDetalleCurso.isPresent()) {
            DocenteNivelDetalleCurso updated = existingDocenteNivelDetalleCurso.get();
            updated.setDocente(docenteNivelDetalleCursoDetails.getDocente());
            updated.setNivelDetalleCurso(docenteNivelDetalleCursoDetails.getNivelDetalleCurso());
            updated.setActivo(docenteNivelDetalleCursoDetails.isActivo());
            docenteNivelDetalleCursoService.save(updated);
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        Optional<DocenteNivelDetalleCurso> existingDocenteNivelDetalleCurso = docenteNivelDetalleCursoService
                .findById(id);
        if (existingDocenteNivelDetalleCurso.isPresent()) {
            docenteNivelDetalleCursoService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}