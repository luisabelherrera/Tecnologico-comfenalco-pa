package com.example.demo.controller.entityController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.entity.Curricular;
import com.example.demo.repositories.jpa.CurricularRepository;
import com.example.demo.services.service.CurricularService;
import com.example.demo.services.service.impl.CurricularServiceImpl;
import com.example.demo.exceptions.customexceptions.exceptionsEntity.CurricularNotFoundException;

import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api/curriculares")
public class CurricularController {

    @Autowired
    private CurricularService curricularService;

    @Autowired
        private CurricularServiceImpl curricularRepository;

    

    @GetMapping
    public ResponseEntity<List<Curricular>> getAllCurriculares() {
        List<Curricular> curriculares = curricularService.findAll();
        return ResponseEntity.ok(curriculares);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Curricular> getCurricularById(@PathVariable Integer id) {
        Optional<Curricular> curricular = curricularService.findById(id);
        if (curricular.isPresent()) {
            return ResponseEntity.ok(curricular.get());
        } else {
            throw new CurricularNotFoundException(id);
        }
    }

    @PostMapping
    public ResponseEntity<Curricular> createCurricular(@RequestBody Curricular curricular) {
        Curricular nuevoCurricular = curricularService.save(curricular);
        return ResponseEntity.ok(nuevoCurricular);
    }
@GetMapping("/docente/{idDocente}")
public ResponseEntity<List<Curricular>> getCurricularesPorDocente(@PathVariable Integer idDocente) {
  List<Curricular> curriculares = curricularRepository.findByDocenteId(idDocente);
  return new ResponseEntity<>(curriculares, HttpStatus.OK);
}
    @PutMapping("/{id}")
    public ResponseEntity<Curricular> updateCurricular(@PathVariable Integer id,
                                                       @RequestBody Curricular curricularDetalles) {
        Optional<Curricular> curricularExistente = curricularService.findById(id);
        if (curricularExistente.isPresent()) {
            Curricular curricular = curricularExistente.get();
            curricular.setDescripcion(curricularDetalles.getDescripcion());
            curricular.setDocenteNivelDetalleCurso(curricularDetalles.getDocenteNivelDetalleCurso());
            Curricular curricularActualizado = curricularService.save(curricular);
            return ResponseEntity.ok(curricularActualizado);
        } else {
            throw new CurricularNotFoundException(id);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCurricular(@PathVariable Integer id) {
        Optional<Curricular> curricular = curricularService.findById(id);
        if (curricular.isPresent()) {
            curricularService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            throw new CurricularNotFoundException(id);
        }
    }
}
