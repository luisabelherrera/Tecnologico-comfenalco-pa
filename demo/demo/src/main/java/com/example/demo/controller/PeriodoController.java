package com.example.demo.controller;


import com.example.demo.model.entities.Periodo;
import com.example.demo.services.PeriodoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@Controller
@RequestMapping("/periodos")
public class PeriodoController {

    private final PeriodoService periodoService;

    @Autowired
    public PeriodoController(PeriodoService periodoService) {
        this.periodoService = periodoService;
    }

    @GetMapping("/lista")
    public String listarPeriodos(Model model) {
        Iterable<Periodo> periodos = periodoService.listar();
        model.addAttribute("periodos", periodos);
        return "Administrador/html/Periodo/listar";
    }


    @GetMapping("/crear")
    public String mostrarFormularioCreacion(Model model) {
        model.addAttribute("periodo", new Periodo());
        return "Administrador/html/Periodo/agregar";
    }

    @PostMapping("/crear")
    public String crearPeriodo(@Valid @ModelAttribute Periodo periodo, BindingResult result, Model model) {
        if (result.hasErrors()) {
            model.addAttribute("errors", result.getAllErrors());
            return "Administrador/html/Periodo/agregar";
        }
        periodoService.crear(periodo);
        return "redirect:/periodos/lista";
    }


    @GetMapping("/editar/{id}")
    public String mostrarFormularioEdicion(@PathVariable Long id, Model model) {
        Optional<Periodo> periodoOptional = periodoService.obtenerPorId(id);
        if (periodoOptional.isPresent()) {
            model.addAttribute("periodos", periodoOptional.get());
            return "Administrador/html/Periodo/editar";
        } else {
            return "redirect:/periodos/lista";
        }
    }

    @PostMapping("/editar/{id}")
    public String editarPeriodo(@PathVariable Long id, @ModelAttribute Periodo periodoDetalles) {
        periodoService.actualizar(id, periodoDetalles);
        return "redirect:/periodos/lista";
    }

    @GetMapping("/eliminar/{id}")
    public String eliminarPeriodo(@PathVariable Long id) {
        periodoService.eliminar(id);
        return "redirect:/periodos/lista";
    }
}