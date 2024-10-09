package com.example.demo.controller.traspaso;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.entity.Acudiente;
import com.example.demo.services.service.AcudienteService;

@RestController
@RequestMapping("/api/acudientes")
public class AcudienteController {

    @Autowired
    private AcudienteService acudienteService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Acudiente>> getAllAcudientes() {
        List<Acudiente> acudientes = acudienteService.findAll();
        return ResponseEntity.ok(acudientes);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Acudiente> getAcudienteById(@PathVariable Integer id) {
        Optional<Acudiente> acudiente = acudienteService.findById(id);
        return acudiente.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<Acudiente> createAcudiente(@RequestBody Acudiente acudiente) {
        Acudiente savedAcudiente = acudienteService.save(acudiente);
        return ResponseEntity.ok(savedAcudiente);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Acudiente> updateAcudiente(@PathVariable Integer id,
            @RequestBody Acudiente acudiente) {
        Optional<Acudiente> existingAcudiente = acudienteService.findById(id);
        if (existingAcudiente.isPresent()) {
            acudiente.setIdAcudiente(id); // Asegúrate de establecer el ID al actualizar
            Acudiente savedAcudiente = acudienteService.save(acudiente);
            return ResponseEntity.ok(savedAcudiente);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAcudiente(@PathVariable Integer id) {
        Optional<Acudiente> acudiente = acudienteService.findById(id);
        if (acudiente.isPresent()) {
            acudienteService.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
