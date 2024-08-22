package com.example.demo.controller;


import com.example.demo.model.entities.AsignaturaCursada;
import com.example.demo.model.entities.Curso;
import com.example.demo.model.entities.Estudiante;
import com.example.demo.model.entities.Matricula;
import com.example.demo.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Optional;

@Controller
@RequestMapping("/matriculas")
public class MatriculaController {


    @Autowired
    private MatriculaService matriculaService;


    @Autowired
    private EstudianteService estudianteService;
    @Autowired
    private CursoService cursoService;

    @Autowired
    private AsignaturaCursadaService asignaturaCursadaService;



    @GetMapping("/lista")
    public String listarMatriculas(Model modelo) {
        Iterable<Matricula> matriculas = matriculaService.listar();
        modelo.addAttribute("matriculas", matriculas);
        return "Administrador/html/Matricula/TablaMatricula";
    }

    @GetMapping("/formulario-crear")
    public String mostrarFormularioCrear(Model modelo) {

   modelo.addAttribute("matricula", new Matricula());
   Iterable<Estudiante> estudiantes = estudianteService.listar();
        modelo.addAttribute("estudiantes", estudiantes);

        Iterable<Curso> cursos = cursoService.listar();
        modelo.addAttribute("cursos", cursos);
 Iterable<AsignaturaCursada> asignaturasCursadas = asignaturaCursadaService.listar();
        modelo.addAttribute("asignaturasCursadas", asignaturasCursadas);
 return "Administrador/html/Matricula/AgregarMatricula";
    }


    @PostMapping("/crear")
    public RedirectView crearMatricula(@ModelAttribute Matricula matricula, RedirectAttributes redirectAttributes) {
        matriculaService.crear(matricula);
        redirectAttributes.addFlashAttribute("mensaje", "Matrícula creada correctamente");
        return new RedirectView("/matriculas/lista");
    }


    @GetMapping("/formulario-editar/{id}")
    public String mostrarFormularioEditar(@PathVariable Long id, Model modelo) {
        Optional<Matricula> matricula = matriculaService.obtenerPorId(id);
        if (matricula.isPresent()) {
            modelo.addAttribute("matricula", matricula.get());
            return "Administrador/html/Matricula/EditarMatricula";
        } else {
            return "redirect:/matriculas/lista";
        }
    }


    @PostMapping("/editar/{id}")
    public RedirectView editarMatricula(@PathVariable Long id, @ModelAttribute Matricula matriculaDetalles, RedirectAttributes redirectAttributes) {
        Matricula matriculaActualizada = matriculaService.actualizar(id, matriculaDetalles);
        if (matriculaActualizada != null) {
            redirectAttributes.addFlashAttribute("mensaje", "Matrícula actualizada correctamente");
        } else {
            redirectAttributes.addFlashAttribute("error", "Error al actualizar matrícula");
        }
        return new RedirectView("/matriculas/lista");
    }


    @PostMapping("/eliminar/{id}")
    public RedirectView eliminarMatricula(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            matriculaService.eliminarPorId(id);
            redirectAttributes.addFlashAttribute("mensaje", "Matrícula eliminada correctamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al eliminar matrícula");
        }
        return new RedirectView("/matriculas/lista");
    }
}