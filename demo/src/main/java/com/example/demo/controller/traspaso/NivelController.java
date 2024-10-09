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

import com.example.demo.model.entity.Nivel;
import com.example.demo.services.service.NivelService;

@RestController
@RequestMapping("/api/nivel")
public class NivelController {

    @Autowired
    private NivelService nivelService;

    // Obtener todos los niveles
    @GetMapping
    public ResponseEntity<List<Nivel>> getAllNiveles() {
        List<Nivel> niveles = nivelService.findAll();
        return ResponseEntity.ok(niveles);
    }

    // Obtener un nivel por ID
    @GetMapping("/{id}")
    public ResponseEntity<Nivel> getNivelById(@PathVariable Integer id) {
        return nivelService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Crear un nuevo nivel
    @PostMapping
    public ResponseEntity<Nivel> createNivel(@RequestBody Nivel nivel) {
        if (nivel.getPeriodo() == null || nivel.getPeriodo().getIdPeriodo() == null) {
            return ResponseEntity.badRequest().build(); // Retorna 400 si el periodo es nulo o no tiene ID
        }

        Nivel nuevoNivel = nivelService.save(nivel);
        return ResponseEntity.ok(nuevoNivel);
    }

    // Actualizar un nivel existente
    @PutMapping("/{id}")
    public ResponseEntity<Nivel> updateNivel(@PathVariable Integer id, @RequestBody Nivel nivelDetalles) {
        Optional<Nivel> nivelExistente = nivelService.findById(id);
        if (nivelExistente.isPresent()) {
            Nivel nivel = nivelExistente.get();
            nivel.setDescripcionNivel(nivelDetalles.getDescripcionNivel());
            nivel.setDescripcionTurno(nivelDetalles.getDescripcionTurno());
            nivel.setHoraInicio(nivelDetalles.getHoraInicio());
            nivel.setHoraFin(nivelDetalles.getHoraFin());
            nivel.setActivo(nivelDetalles.isActivo());

            if (nivelDetalles.getPeriodo() != null) {
                nivel.setPeriodo(nivelDetalles.getPeriodo());
            }

            Nivel nivelActualizado = nivelService.save(nivel);
            return ResponseEntity.ok(nivelActualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Eliminar un nivel por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNivel(@PathVariable Integer id) {
        if (nivelService.findById(id).isPresent()) {
            nivelService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
