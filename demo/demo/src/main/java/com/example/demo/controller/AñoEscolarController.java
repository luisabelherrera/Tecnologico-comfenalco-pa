package com.example.demo.controller;
import com.example.demo.model.entities.AñoEscolar;

import com.example.demo.model.entities.Periodo;
import com.example.demo.services.AñoEscolarService;
import com.example.demo.services.PeriodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Controller
@RequestMapping("/anio-escolar")
public class AñoEscolarController {

    private final AñoEscolarService añoEscolarService;
    private final PeriodoService periodoService;

    @Autowired
    public AñoEscolarController(AñoEscolarService añoEscolarService, PeriodoService periodoService) {
        this.añoEscolarService = añoEscolarService;
        this.periodoService = periodoService;
    }

    @GetMapping("/lista")
    public String listarAñosEscolares(Model model) {
        Iterable<AñoEscolar> añosEscolares = añoEscolarService.listar();
        model.addAttribute("añosEscolares", añosEscolares);
        return "Administrador/html/Añoescolar/listar";
    }

    @GetMapping("/crear")
    public String mostrarFormularioCreacion(Model model) {
        model.addAttribute("añosEscolares", new AñoEscolar());
        Iterable<Periodo> periodos = periodoService.listar();
        model.addAttribute("periodos", periodos);
        return "Administrador/html/Añoescolar/agregar";
    }

    @PostMapping("/crear")
    public String crearAñoEscolar(@ModelAttribute AñoEscolar añosEscolares) {
        añoEscolarService.crear(añosEscolares);
        return "redirect:/anio-escolar/lista";
    }

    @GetMapping("/editar/{id}")
    public String mostrarFormularioEdicion(@PathVariable Long id, Model model) {
        Optional<AñoEscolar> añoEscolarOptional = añoEscolarService.obtenerPorId(id);
        if (añoEscolarOptional.isPresent()) {
            model.addAttribute("añosEscolares", añoEscolarOptional.get());
            Iterable<Periodo> periodos = periodoService.listar();
            model.addAttribute("periodos", periodos);
            return "Administrador/html/Añoescolar/editar";
        } else {
            return "redirect:/anio-escolar/lista";
        }
    }

    @PostMapping("/editar/{id}")
    public String actualizarAñoEscolar(@PathVariable Long id, @ModelAttribute AñoEscolar añosEscolaresDetalles) {
        añoEscolarService.actualizar(id, añosEscolaresDetalles);
        return "redirect:/anio-escolar/lista";
    }

    @GetMapping("/eliminar/{id}")
    public String eliminarAñoEscolar(@PathVariable Long id) {
        añoEscolarService.eliminar(id);
        return "redirect:/anio-escolar/lista";
    }
}