package com.example.demo.controller.entityController;

import java.util.List;
import java.util.Optional;
import org.springframework.web.bind.annotation.CrossOrigin;
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

import com.example.demo.model.entity.Docente;
import com.example.demo.services.service.DocenteService;

@CrossOrigin
@RestController
@RequestMapping("/api/docentes")
public class DocenteController {

    @Autowired
    private DocenteService docenteService;

    @GetMapping
    public ResponseEntity<List<Docente>> getAllDocentes() {
        List<Docente> docentes = docenteService.findAll();
        return ResponseEntity.ok(docentes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Docente> getDocenteById(@PathVariable Integer id) {
        Optional<Docente> docente = docenteService.findById(id);
        if (docente.isPresent()) {
            return ResponseEntity.ok(docente.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Docente> createDocente(@RequestBody Docente docente) {
        Docente nuevoDocente = docenteService.save(docente);
        return ResponseEntity.ok(nuevoDocente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Docente> updateDocente(@PathVariable Integer id, @RequestBody Docente docenteDetalles) {
        Optional<Docente> docenteExistente = docenteService.findById(id);
        if (docenteExistente.isPresent()) {
            Docente docente = docenteExistente.get();

            docente.setCodigo(docenteDetalles.getCodigo());
            docente.setDocumentoIdentidad(docenteDetalles.getDocumentoIdentidad());
            docente.setNombres(docenteDetalles.getNombres());
            docente.setApellidos(docenteDetalles.getApellidos());
            docente.setFechaNacimiento(docenteDetalles.getFechaNacimiento());
            docente.setSexo(docenteDetalles.getSexo());
            docente.setGradoEstudio(docenteDetalles.getGradoEstudio());
            docente.setCiudad(docenteDetalles.getCiudad());
            docente.setDireccion(docenteDetalles.getDireccion());
            docente.setEmail(docenteDetalles.getEmail());
            docente.setNumeroTelefono(docenteDetalles.getNumeroTelefono());
            docente.setActivo(docenteDetalles.isActivo());
            Docente docenteActualizado = docenteService.save(docente);
            return ResponseEntity.ok(docenteActualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocente(@PathVariable Integer id) {
        Optional<Docente> docente = docenteService.findById(id);
        if (docente.isPresent()) {
            docenteService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
