package com.example.demo.controller;


import com.example.demo.model.entities.AsignaturaCursada;
import com.example.demo.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/asignatura-cursada")
public class AsignaturaCursadaController {

    @Autowired
    private AsignaturaCursadaService asignaturaCursadaService;
    @Autowired
    private AñoEscolarService añoEscolarService;
    @Autowired
    private CursoService cursoService;
    @Autowired
    private EstudianteService estudianteService;
    @Autowired
    private AsignaturaService asignaturaService;
    @Autowired
    private ProfesorService profesorService;


    @GetMapping("/listar")
    public String listarAsignaturasCursadas(Model model) {
        List<AsignaturaCursada> asignaturasCursadas = asignaturaCursadaService.listar();
        model.addAttribute("asignaturasCursadas", asignaturasCursadas);
        return "Administrador/html/AsignaturaCursada/ListaAsignaturaCursada";
    }


    @GetMapping("/agregar")
    public String mostrarFormularioAgregar(Model model) {
        model.addAttribute("asignaturaCursada", new AsignaturaCursada());
        model.addAttribute("aniosEscolares", añoEscolarService.listar());
        model.addAttribute("cursos", cursoService.listar());
        model.addAttribute("estudiantes", estudianteService.listar());
        model.addAttribute("asignaturas", asignaturaService.listar());
        model.addAttribute("profesores", profesorService.listar());
        return "Administrador/html/AsignaturaCursada/AgregarAsignaturaCursada";
    }


    @PostMapping("/agregar")
    public String agregarAsignaturaCursada(@ModelAttribute AsignaturaCursada asignaturaCursada) {
        asignaturaCursadaService.guardar(asignaturaCursada);
        return "redirect:/asignatura-cursada/listar";
    }


    @GetMapping("/editar/{id}")
    public String mostrarFormularioEditar(@PathVariable("id") Long id, Model model) {
        AsignaturaCursada asignaturaCursada = asignaturaCursadaService.obtenerPorId(id);
        model.addAttribute("asignaturaCursada", asignaturaCursada);
        model.addAttribute("aniosEscolares", añoEscolarService.listar());
        model.addAttribute("cursos", cursoService.listar());
        model.addAttribute("estudiantes", estudianteService.listar());
        model.addAttribute("asignaturas", asignaturaService.listar());
        model.addAttribute("profesores", profesorService.listar());
        return "Administrador/html/AsignaturaCursada/EditarAsignaturaCursada";
    }


    @PostMapping("/editar")
    public String editarAsignaturaCursada(@ModelAttribute AsignaturaCursada asignaturaCursada) {
        asignaturaCursadaService.actualizar(asignaturaCursada);
        return "redirect:/asignatura-cursada/listar";
    }


    @GetMapping("/eliminar/{id}")
    public String eliminarAsignaturaCursada(@PathVariable("id") Long id) {
        asignaturaCursadaService.eliminar(id);
        return "redirect:/asignatura-cursada/listar";
    }
}