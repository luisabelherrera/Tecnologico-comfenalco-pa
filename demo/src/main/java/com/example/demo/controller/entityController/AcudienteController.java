package com.example.demo.controller.entityController;

import java.util.List;
import java.util.Optional;

import com.example.demo.model.entity.dto.AcudienteDTO;
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
import com.example.demo.services.service.AcudienteService;

@CrossOrigin
@RestController
@RequestMapping("/api/acudientes")
public class AcudienteController {

    @Autowired
    private AcudienteService acudienteService;

    @GetMapping
    public ResponseEntity<List<AcudienteDTO>> getAllAcudientes() {
        List<AcudienteDTO> acudientes = acudienteService.findAll();
        return ResponseEntity.ok(acudientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AcudienteDTO> getAcudienteById(@PathVariable long id) {
        Optional<AcudienteDTO> acudiente = acudienteService.findById(id);
        return acudiente.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AcudienteDTO> createAcudiente(@RequestBody AcudienteDTO acudienteDTO) {
        AcudienteDTO nuevoAcudiente = acudienteService.save(acudienteDTO);
        return ResponseEntity.ok(nuevoAcudiente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AcudienteDTO> updateAcudiente(@PathVariable long id,
            @RequestBody AcudienteDTO acudienteDetalles) {
        acudienteDetalles.setIdAcudiente(id);
        AcudienteDTO acudienteActualizado = acudienteService.save(acudienteDetalles);
        return ResponseEntity.ok(acudienteActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAcudiente(@PathVariable long id) {
        acudienteService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}