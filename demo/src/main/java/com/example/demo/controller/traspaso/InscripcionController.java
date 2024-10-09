package com.example.demo.controller.traspaso;

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

import com.example.demo.model.entity.Inscripcion;
import com.example.demo.services.service.InscripcionService;

@RestController
@RequestMapping("/api/inscripciones") 
public class InscripcionController { 

    @Autowired
    private InscripcionService inscripcionService;

    @GetMapping
    public ResponseEntity<List<Inscripcion>> getAllInscripciones() { 
        List<Inscripcion> inscripciones = inscripcionService.findAll(); 
        return ResponseEntity.ok(inscripciones);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inscripcion> getInscripcionById(@PathVariable Integer id) { 
        Optional<Inscripcion> inscripcion = inscripcionService.findById(id); 
        return inscripcion.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Inscripcion> createInscripcion(@RequestBody Inscripcion inscripcion) { 
                                                                                             
        Inscripcion savedInscripcion = inscripcionService.save(inscripcion); 
        return ResponseEntity.status(HttpStatus.CREATED).body(savedInscripcion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inscripcion> updateInscripcion(@PathVariable Integer id,
            @RequestBody Inscripcion inscripcion) { 
        inscripcion.setIdInscripcion(id);
        Inscripcion updatedInscripcion = inscripcionService.save(inscripcion);
        return ResponseEntity.ok(updatedInscripcion);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInscripcion(@PathVariable Integer id) { 
        inscripcionService.deleteById(id); 
        return ResponseEntity.noContent().build();
    }
}
