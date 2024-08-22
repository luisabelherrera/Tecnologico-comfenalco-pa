package com.example.demo.controller;


import com.example.demo.model.entities.Profesor;
import com.example.demo.services.ProfesorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/profesores")
public class ProfesorController {

    private final ProfesorService profesorService;

    @Autowired
    public ProfesorController(ProfesorService profesorService) {
        this.profesorService = profesorService;
    }

    @GetMapping("/lista")
    public String listarProfesores(@RequestParam(value="filtro", required=false) String filtro, Model model) {
        List<Profesor> profesores;
        if (filtro != null && !filtro.isEmpty()) {
            profesores = profesorService.filtrarPorNombre(filtro);
        } else {
            profesores = (List<Profesor>) profesorService.listar();
        }
        model.addAttribute("profesor", profesores);
        model.addAttribute("filtro", filtro);
        return "Administrador/html/profesores/TablaProfesor";
    }


    @GetMapping("/crear")
    public String mostrarFormularioCreacion(Model model) {
        model.addAttribute("profesor", new Profesor());
        return "Administrador/html/profesores/agregarProfesor";
    }

    @PostMapping("/crear")
    public RedirectView crearProfesor(@ModelAttribute Profesor profesor, RedirectAttributes redirectAttributes) {
        profesorService.crear(profesor);
        redirectAttributes.addFlashAttribute("mensaje", "Profesor creado correctamente");
        return new RedirectView("/profesores/lista");
    }

    @GetMapping("/editar/{id}")
    public String mostrarFormularioEditarProfesor(@PathVariable Long id, Model model, RedirectAttributes redirectAttributes) {
        Optional<Profesor> profesorOptional = profesorService.obtenerPorId(id);

        if (profesorOptional.isPresent()) {
            model.addAttribute("profesor", profesorOptional.get());
            return "Administrador/html/profesores/editarProfesor";
        } else {
            redirectAttributes.addFlashAttribute("error", "El profesor con ID " + id + " no existe.");
            return "redirect:/profesores/lista";
        }
    }

    @PostMapping("/actualizar/{id}")
    public RedirectView actualizarProfesor(@PathVariable Long id, @ModelAttribute Profesor profesorDetalles, RedirectAttributes redirectAttributes) {
        try {
            profesorService.actualizar(id, profesorDetalles);
            redirectAttributes.addFlashAttribute("mensaje", "Profesor actualizado correctamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al actualizar el profesor");
        }
        return new RedirectView("/profesores/lista");
    }

    @GetMapping("/eliminar/{id}")
    public RedirectView eliminarProfesor(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            profesorService.eliminar(id);
            redirectAttributes.addFlashAttribute("mensaje", "Profesor eliminado correctamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al eliminar el profesor");
        }
        return new RedirectView("/profesores/lista");
    }
}