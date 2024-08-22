package com.example.demo.controller;

import com.example.demo.model.entities.Calificacion;
import com.example.demo.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


import java.util.Optional;

@Controller
@RequestMapping("/calificaciones")
public class CalificacionController {

    @Autowired
    private CalificacionService calificacionService;

    @Autowired
    private PeriodoService periodoService;

    @Autowired
    private EstudianteService estudianteService;

    @Autowired
    private ProfesorService profesorService;

    @Autowired
    private AsignaturaCursadaService asignaturaCursadaService;


    @GetMapping("/listar")
    public String listarCalificaciones(Model model) {
        Iterable<Calificacion> calificaciones = calificacionService.listar();
        model.addAttribute("calificaciones", calificaciones);
        return "Administrador/html/Calificaciones/TablaNotas";
    }

    @GetMapping("/agregar")
    public String mostrarFormularioAgregar(Model model) {
        model.addAttribute("calificacion", new Calificacion());
        model.addAttribute("periodos", periodoService.listar());
        model.addAttribute("estudiantes", estudianteService.listar());
        model.addAttribute("profesores", profesorService.listar());
        model.addAttribute("asignaturasCursadas", asignaturaCursadaService.listar());
        return "Administrador/html/Calificaciones/agregarNota";
    }


    @PostMapping("/agregar")
    public String agregarCalificacion(@ModelAttribute Calificacion calificacion) {
        calificacionService.guardar(calificacion);
        return "redirect:/calificaciones/listar";
    }


    @GetMapping("/editar/{id}")
    public String mostrarFormularioEditar(@PathVariable("id") Long id, Model model) {
        Optional<Calificacion> calificacion = calificacionService.buscarPorId(id);
        model.addAttribute("calificacion", calificacion);
        model.addAttribute("periodos", periodoService.listar());
        model.addAttribute("estudiantes", estudianteService.listar());
        model.addAttribute("profesores", profesorService.listar());
        model.addAttribute("asignaturasCursadas", asignaturaCursadaService.listar());
        return "Administrador/html/Calificaciones/EditarCalificacion";
    }


    @PostMapping("/editar")
    public String editarCalificacion(@ModelAttribute Calificacion calificacion) {
        calificacionService.actualizar(calificacion);
        return "redirect:/calificaciones/listar";
    }


    @GetMapping("/eliminar/{id}")
    public String eliminarCalificacion(@PathVariable("id") Long id) {
        calificacionService.eliminar(id);
        return "redirect:/calificaciones/listar";
    }
}