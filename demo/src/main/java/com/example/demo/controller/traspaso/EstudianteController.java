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

import com.example.demo.model.entity.Estudiante;
import com.example.demo.services.service.EstudianteService;

@RestController
@RequestMapping("/api/estudiantes")
public class EstudianteController {

    @Autowired
    private EstudianteService estudianteService;

    @GetMapping
    public ResponseEntity<List<Estudiante>> getAllEstudiantes() {
        List<Estudiante> estudiantes = estudianteService.findAll();
        return ResponseEntity.ok(estudiantes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Estudiante> getEstudianteById(@PathVariable Integer id) {
        Optional<Estudiante> estudiante = estudianteService.findById(id);
        return estudiante.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Estudiante> createEstudiante(@RequestBody Estudiante estudiante) {
        Estudiante nuevoEstudiante = estudianteService.save(estudiante);
        return ResponseEntity.ok(nuevoEstudiante);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Estudiante> updateEstudiante(@PathVariable Integer id,
            @RequestBody Estudiante estudianteDetalles) {
        Optional<Estudiante> estudianteExistente = estudianteService.findById(id);
        if (estudianteExistente.isPresent()) {
            Estudiante estudiante = estudianteExistente.get();

            estudiante.setValorCodigo(estudianteDetalles.getValorCodigo());
            estudiante.setCodigo(estudianteDetalles.getCodigo());
            estudiante.setNombres(estudianteDetalles.getNombres());
            estudiante.setApellidos(estudianteDetalles.getApellidos());
            estudiante.setDocumentoIdentidad(estudianteDetalles.getDocumentoIdentidad());
            estudiante.setFechaNacimiento(estudianteDetalles.getFechaNacimiento());
            estudiante.setSexo(estudianteDetalles.getSexo());
            estudiante.setCiudad(estudianteDetalles.getCiudad());
            estudiante.setDireccion(estudianteDetalles.getDireccion());
            estudiante.setActivo(estudianteDetalles.isActivo());
            Estudiante estudianteActualizado = estudianteService.save(estudiante);
            return ResponseEntity.ok(estudianteActualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEstudiante(@PathVariable Integer id) {
        Optional<Estudiante> estudiante = estudianteService.findById(id);
        if (estudiante.isPresent()) {
            estudianteService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
