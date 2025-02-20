package com.example.demo.controller.entityController;

import com.example.demo.exceptions.customexceptions.exceptionsEntity.AcudienteNotFoundException;
import com.example.demo.model.entity.Acudiente;
import com.example.demo.model.entity.dto.AcudienteDTO;
import com.example.demo.model.entity.dto.PaginatedResponse;
import com.example.demo.services.service.AcudienteService;
import org.springframework.beans.factory.annotation.Autowired;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedModel;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api/acudientes")
public class AcudienteController {

    @Autowired
    private AcudienteService acudienteService;

    @GetMapping("/acudientes")
    public ResponseEntity<Page<AcudienteDTO>> getAcudientes(
            @RequestParam(required = false) String nombres,
            @RequestParam(required = false) String documentoIdentidad,
            Pageable pageable) {

        Page<AcudienteDTO> acudientesPage = acudienteService.findByFilters(nombres, documentoIdentidad, pageable);
        return ResponseEntity.ok(acudientesPage);
    }






    @GetMapping("/{id}")
    public ResponseEntity<AcudienteDTO> getAcudienteById(@PathVariable Integer id) {
        Optional<AcudienteDTO> acudiente = acudienteService.findById(id);
        return acudiente.map(ResponseEntity::ok)
                .orElseThrow(() -> new AcudienteNotFoundException(id));
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
