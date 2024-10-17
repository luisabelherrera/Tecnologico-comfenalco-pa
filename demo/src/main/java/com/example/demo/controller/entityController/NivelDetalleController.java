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

import com.example.demo.model.entity.NivelDetalle;
import com.example.demo.services.service.NivelDetalleService;

@RestController
@RequestMapping("/api/nivel-detalle")
public class NivelDetalleController {

    @Autowired
    private NivelDetalleService nivelDetalleService;

    @GetMapping
    public ResponseEntity<List<NivelDetalle>> getAllNivelDetalles() {
        List<NivelDetalle> nivelDetalles = nivelDetalleService.findAll();
        return ResponseEntity.ok(nivelDetalles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NivelDetalle> getNivelDetalleById(@PathVariable Integer id) {
        Optional<NivelDetalle> nivelDetalle = nivelDetalleService.findById(id);
        return nivelDetalle.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<NivelDetalle> createNivelDetalle(@RequestBody NivelDetalle nivelDetalle) {
        NivelDetalle nuevoNivelDetalle = nivelDetalleService.save(nivelDetalle);
        return ResponseEntity.ok(nuevoNivelDetalle);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NivelDetalle> updateNivelDetalle(@PathVariable Integer id,

            @RequestBody NivelDetalle nivelDetalleDetalles) {
        Optional<NivelDetalle> nivelDetalleExistente = nivelDetalleService.findById(id);
        if (nivelDetalleExistente.isPresent()) {
            NivelDetalle nivelDetalle = nivelDetalleExistente.get();
            // Actualizar los campos necesarios
            nivelDetalle.setTotalVacantes(nivelDetalleDetalles.getTotalVacantes());
            nivelDetalle.setVacantesDisponibles(nivelDetalleDetalles.getVacantesDisponibles());
            nivelDetalle.setVacantesOcupadas(nivelDetalleDetalles.getVacantesOcupadas());
            nivelDetalle.setActivo(nivelDetalleDetalles.isActivo());
            NivelDetalle nivelDetalleActualizado = nivelDetalleService.save(nivelDetalle);
            return ResponseEntity.ok(nivelDetalleActualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNivelDetalle(@PathVariable Integer id) {
        Optional<NivelDetalle> nivelDetalle = nivelDetalleService.findById(id);
        if (nivelDetalle.isPresent()) {
            nivelDetalleService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
