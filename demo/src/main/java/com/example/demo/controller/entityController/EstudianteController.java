package com.example.demo.controller.entityController;

import java.util.List;
import java.util.Optional;

import com.example.demo.exceptions.messages.ErrorMessages;
import com.example.demo.model.entity.dto.EstudianteDTO;

import com.example.demo.exceptions.customexceptions.exceptionsEntity.EstudianteException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.services.service.EstudianteService;

@CrossOrigin
@RestController
@RequestMapping("/api/estudiantes")
public class EstudianteController {

    @Autowired
    private EstudianteService estudianteService;

    @GetMapping
    public ResponseEntity<List<EstudianteDTO>> getAllEstudiantes() {
        List<EstudianteDTO> estudiantes = estudianteService.findAll();
        return ResponseEntity.ok(estudiantes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstudianteDTO> getEstudianteById(@PathVariable Integer id) {
        Optional<EstudianteDTO> estudiante = estudianteService.findById(id);
        if (estudiante.isPresent()) {
            return ResponseEntity.ok(estudiante.get());
        } else {
            throw new EstudianteException(ErrorMessages.ESTUDIANTE_NOT_FOUND + id);
        }
    }

    @PostMapping
    public ResponseEntity<EstudianteDTO> createEstudiante(@RequestBody EstudianteDTO estudianteDTO) {
        try {
            EstudianteDTO nuevoEstudiante = estudianteService.save(estudianteDTO);
            return ResponseEntity.ok(nuevoEstudiante);
        } catch (Exception e) {
            throw new EstudianteException(ErrorMessages.ESTUDIANTE_CREACION_ERROR, e);
        }
    }



    
    @PutMapping("/{id}")
    public ResponseEntity<EstudianteDTO> updateEstudiante(@PathVariable Integer id, @RequestBody EstudianteDTO estudianteDetalles) {
        Optional<EstudianteDTO> estudianteExistente = estudianteService.findById(id);
        if (estudianteExistente.isPresent()) {
            try {
                estudianteDetalles.setIdEstudiante(id); // Asegurar que el ID coincida
                EstudianteDTO estudianteActualizado = estudianteService.save(estudianteDetalles);
                return ResponseEntity.ok(estudianteActualizado);
            } catch (Exception e) {
                throw new EstudianteException(ErrorMessages.ESTUDIANTE_ACTUALIZACION_ERROR, e);
            }
        } else {
            throw new EstudianteException(ErrorMessages.ESTUDIANTE_NOT_FOUND + id);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEstudiante(@PathVariable Integer id) {
        Optional<EstudianteDTO> estudiante = estudianteService.findById(id);
        if (estudiante.isPresent()) {
            try {
                estudianteService.deleteById(id);
                return ResponseEntity.noContent().build();
            } catch (Exception e) {
                throw new EstudianteException(ErrorMessages.ESTUDIANTE_ELIMINACION_ERROR, e);
            }
        } else {
            throw new EstudianteException(ErrorMessages.ESTUDIANTE_NOT_FOUND + id);
        }
    }
}
