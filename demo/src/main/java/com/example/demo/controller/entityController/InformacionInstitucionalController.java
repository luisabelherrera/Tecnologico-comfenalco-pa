package com.example.demo.controller.entityController;

import com.example.demo.model.entity.InformacionInstitucional;

import com.example.demo.services.service.InformacionInstitucionalService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api/institucion")
public class InformacionInstitucionalController {

    @Autowired
    private InformacionInstitucionalService informacionInstitucionalService;

    // Acceso público
    @GetMapping
    @PreAuthorize("permitAll()") // No necesario si ya permitiste en SecurityConfig
    public ResponseEntity<InformacionInstitucional> getInformacion() {
        Optional<InformacionInstitucional> informacion = informacionInstitucionalService.findFirst();
        return informacion.map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    // Solo administradores
    @PostMapping
    public ResponseEntity<?> createInformacion(@RequestBody InformacionInstitucional informacion) {
        Optional<InformacionInstitucional> existing = informacionInstitucionalService.findFirst();
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Ya existe un registro de información institucional. Usa PUT para actualizarlo.");
        }
        try {
            InformacionInstitucional savedInformacion = informacionInstitucionalService.save(informacion);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedInformacion);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Solo administradores
    @PutMapping
    public ResponseEntity<?> updateInformacion(@RequestBody InformacionInstitucional informacion) {
        Optional<InformacionInstitucional> existingInformacion = informacionInstitucionalService.findFirst();
        if (!existingInformacion.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No existe información institucional para actualizar. Crea una primero con POST.");
        }
        informacion.setId(existingInformacion.get().getId());
        try {
            InformacionInstitucional updatedInformacion = informacionInstitucionalService.save(informacion);
            return ResponseEntity.ok(updatedInformacion);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}