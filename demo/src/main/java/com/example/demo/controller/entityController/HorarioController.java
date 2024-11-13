package com.example.demo.controller.entityController;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.exceptions.customexceptions.exceptionsEntity.HorarioException;
import com.example.demo.model.entity.Horario;
import com.example.demo.services.service.HorarioService;

@CrossOrigin
@RestController
@RequestMapping("/api/horario")
public class HorarioController {

    @Autowired
    private HorarioService horarioService;

    @GetMapping
    public ResponseEntity<List<Horario>> getAllHorarios() {
        try {
            List<Horario> horarios = horarioService.findAll();
            return ResponseEntity.ok(horarios);
        } catch (HorarioException ex) {
            // Manejo de excepción HorarioException
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Horario> getHorarioById(@PathVariable Integer id) {
        try {
            Optional<Horario> horario = horarioService.findById(id);
            return horario.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (HorarioException ex) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping
    public ResponseEntity<Horario> createHorario(@RequestBody Horario horario) {
        try {

            Horario nuevoHorario = horarioService.save(horario);
            return ResponseEntity.ok(nuevoHorario);
        } catch (HorarioException ex) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Horario> updateHorario(@PathVariable Integer id, @RequestBody Horario horarioDetalles) {
        try {
            Optional<Horario> horarioExistente = horarioService.findById(id);
            if (horarioExistente.isPresent()) {
                Horario horario = horarioExistente.get();
                horario.setDiaSemana(horarioDetalles.getDiaSemana());
                horario.setHoraInicio(horarioDetalles.getHoraInicio());
                horario.setHoraFin(horarioDetalles.getHoraFin());
                horario.setActivo(horarioDetalles.isActivo());
                Horario horarioActualizado = horarioService.save(horario);
                return ResponseEntity.ok(horarioActualizado);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (HorarioException ex) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHorario(@PathVariable Integer id) {
        try {
            Optional<Horario> horario = horarioService.findById(id);
            if (horario.isPresent()) {
                horarioService.deleteById(id);
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (HorarioException ex) {
            return ResponseEntity.badRequest().build();
        }
    }
}
