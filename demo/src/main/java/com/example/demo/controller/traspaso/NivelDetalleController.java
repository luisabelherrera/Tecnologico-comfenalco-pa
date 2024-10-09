package com.example.demo.controller.traspaso;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.entity.NivelDetalle;
import com.example.demo.services.service.NivelDetalleService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/nivel-detalle")
public class NivelDetalleController {

    @Autowired
    private NivelDetalleService nivelDetalleService;

    // Obtener todos los niveles de detalle
    @GetMapping
    public ResponseEntity<List<NivelDetalle>> getAllNivelDetalles() {
        List<NivelDetalle> nivelDetalles = nivelDetalleService.findAll();
        return ResponseEntity.ok(nivelDetalles);
    }

    // Obtener un nivel de detalle por ID
    @GetMapping("/{id}")
    public ResponseEntity<NivelDetalle> getNivelDetalleById(@PathVariable Integer id) {
        Optional<NivelDetalle> nivelDetalle = nivelDetalleService.findById(id);
        return nivelDetalle.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Crear un nuevo nivel de detalle
    @PostMapping
    public ResponseEntity<NivelDetalle> createNivelDetalle(@RequestBody NivelDetalle nivelDetalle) {
        NivelDetalle nuevoNivelDetalle = nivelDetalleService.save(nivelDetalle);
        return ResponseEntity.ok(nuevoNivelDetalle);
    }

    // Actualizar un nivel de detalle existente
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

    // Eliminar un nivel de detalle por ID
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
