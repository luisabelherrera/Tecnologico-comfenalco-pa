package com.example.demo.controller.entityController;

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
import org.springframework.web.bind.annotation.CrossOrigin;
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
        List<Horario> horarios = horarioService.findAll();

        return ResponseEntity.ok(horarios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Horario> getHorarioById(@PathVariable Integer id) {
        Optional<Horario> horario = horarioService.findById(id);
        return horario.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Horario> createHorario(@RequestBody Horario horario) {
        Horario nuevoHorario = horarioService.save(horario);
        return ResponseEntity.ok(nuevoHorario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Horario> updateHorario(@PathVariable Integer id, @RequestBody Horario horarioDetalles) {
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
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHorario(@PathVariable Integer id) {
        Optional<Horario> horario = horarioService.findById(id);
        if (horario.isPresent()) {
            horarioService.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
