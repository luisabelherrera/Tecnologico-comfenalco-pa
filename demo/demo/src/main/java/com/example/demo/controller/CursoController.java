package com.example.demo.controller;

import com.example.demo.model.entities.AñoEscolar;
import com.example.demo.model.entities.Curso;
import com.example.demo.services.AñoEscolarService;
import com.example.demo.services.CursoService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Optional;


@Controller
@RequestMapping("/cursos")
public class CursoController {

    private final CursoService cursoService;

    private final AñoEscolarService añoEscolarService;


    @Autowired
    public CursoController(CursoService cursoService, AñoEscolarService añoEscolarService) {
        this.cursoService = cursoService;
        this.añoEscolarService = añoEscolarService;
    }

    @GetMapping("/lista")
    public String listarCursos(Model model) {
        Iterable<Curso> cursos = cursoService.listar();
        model.addAttribute("cursos", cursos);
        return "Administrador/html/Curso/TablaCurso";
    }

    @GetMapping("/crear")
    public String mostrarFormularioCreacion(Model model) {
        Iterable<AñoEscolar> aniosEscolares = añoEscolarService.listar();
        model.addAttribute("aniosEscolares", aniosEscolares);
        model.addAttribute("curso", new Curso());
        return "Administrador/html/Curso/AgregarCurso";
    }
    @PostMapping("/crear")
    public RedirectView crearCurso(@ModelAttribute Curso curso, RedirectAttributes redirectAttributes) {
        cursoService.crear(curso);
        redirectAttributes.addFlashAttribute("mensaje", "Curso creado correctamente");
        return new RedirectView("/cursos/lista");
    }

    @GetMapping("/editar/{id}")
    public String mostrarFormularioEditar(@PathVariable Long id, Model model, RedirectAttributes redirectAttributes) {
        Optional<Curso> cursoOptional = cursoService.obtenerPorId(id);

        if (cursoOptional.isPresent()) {
            model.addAttribute("curso", cursoOptional.get());
            return "Administrador/html/Curso/ModificarCurso";
        } else {
            redirectAttributes.addFlashAttribute("error", "El curso con ID " + id + " no existe.");
            return "redirect:/cursos/lista";
        }
    }

    @PostMapping("/actualizar/{id}")
    public RedirectView actualizarCurso(@PathVariable Long id, @ModelAttribute Curso cursoDetalles, RedirectAttributes redirectAttributes) {
        try {
            cursoService.actualizar(id, cursoDetalles);
            redirectAttributes.addFlashAttribute("mensaje", "Curso actualizado correctamente");
        } catch (EntityNotFoundException e) {
            redirectAttributes.addFlashAttribute("error", "Error al actualizar el curso: Curso no encontrado");
        }
        return new RedirectView("/cursos/lista");
    }

    @GetMapping("/eliminar/{id}")
    public RedirectView eliminarCurso(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            cursoService.eliminar(id);
            redirectAttributes.addFlashAttribute("mensaje", "Curso eliminado correctamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al eliminar el curso");
        }
        return new RedirectView("/cursos/lista");
    }
}