package com.example.demo.controller;

import com.example.demo.model.entities.Asignatura;
import com.example.demo.services.AsignaturaService;
import jakarta.validation.Valid;
import org.hibernate.NonUniqueResultException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


import java.util.Optional;

@Controller
@RequestMapping("/asignaturas")
public class AsignaturaController {

    @Autowired
    private AsignaturaService asignaturaService;

    @GetMapping("/lista")
    public String listarAsignaturas(Model modelo) {
        Iterable<Asignatura> asignaturas = asignaturaService.listar();
        modelo.addAttribute("asignaturas", asignaturas);
        return "Administrador/html/Asignatura/ListaAsignatura";
    }


    @GetMapping("/formulario-crear")
    public String mostrarFormularioCrear(Model modelo) {
        modelo.addAttribute("asignatura", new Asignatura());
        return "Administrador/html/Asignatura/AgregarAsignatura";
    }


    @PostMapping("/crear")
    public String crearAsignatura(@Valid @ModelAttribute("asignatura") Asignatura asignatura, BindingResult bindingResult, Model modelo, RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            modelo.addAttribute("mensajeError", "Hay errores en el formulario. Por favor, corrígelos.");
            return "Administrador/html/Asignatura/AgregarAsignatura";
        }
        try {
            Optional<Asignatura> asignaturaExistente = asignaturaService.obtenerPorCodigo(asignatura.getCodigo());
            if (asignaturaExistente.isPresent()) {
                modelo.addAttribute("mensajeError", "Ya existe una asignatura con este código. Intenta con otro.");
                return "Administrador/html/Asignatura/AgregarAsignatura";
            }
            asignaturaService.crear(asignatura);
            redirectAttributes.addFlashAttribute("mensaje", "Asignatura creada correctamente");
            return "redirect:/asignaturas/lista";
        } catch (NonUniqueResultException e) {

            modelo.addAttribute("mensajeError", "Se encontraron múltiples asignaturas con el mismo código. Verifica los datos.");
            return "Administrador/html/Asignatura/AgregarAsignatura";
        } catch (Exception e) {

            redirectAttributes.addFlashAttribute("error", "Ocurrió un error al crear la asignatura.");
            return "redirect:/asignaturas/lista";
        }
    }


    @GetMapping("/formulario-editar/{id}")
    public String mostrarFormularioEditar(@PathVariable Long id, Model modelo) {
        Optional<Asignatura> asignatura = asignaturaService.obtenerPorId(id);
        if (asignatura.isPresent()) {
            modelo.addAttribute("asignatura", asignatura.get());
            return "Administrador/html/Asignatura/EditarAsignatura";
        } else {
            return "redirect:/asignaturas/lista";
        }
    }


    @PostMapping("/actualizar")
    public String actualizarAsignatura(@Valid @ModelAttribute("asignatura") Asignatura asignatura, BindingResult bindingResult, Model modelo) {
        if (bindingResult.hasErrors()) {
           modelo.addAttribute("mensajeError", "Hay errores en el formulario. Por favor, corrígelos.");
            return "Administrador/html/Asignatura/EditarAsignatura";
        }
        try {
            if (asignatura.getCodigo() == null || asignatura.getNombre() == null || (asignatura.getCreditos() <= 0)) {
                modelo.addAttribute("mensajeError", "Los campos 'código', 'nombre' y 'créditos' no pueden ser nulos. Por favor, proporciona valores válidos.");
                return "Administrador/html/Asignatura/EditarAsignatura";
            }
               asignaturaService.actualizar(asignatura.getId(), asignatura);
            modelo.addAttribute("mensaje", "Asignatura actualizada correctamente");
            return "redirect:/asignaturas/lista";
        } catch (DataIntegrityViolationException e) {
           e.printStackTrace();
           modelo.addAttribute("mensajeError", "Ocurrió un error al actualizar la asignatura. Por favor, verifica los datos. Error: " + e.getMessage());
            return "Administrador/html/Asignatura/EditarAsignatura";
        }
    }

    @PostMapping("/editar/{id}")
    public String editarAsignatura(@PathVariable Long id, @Valid @ModelAttribute("asignatura") Asignatura asignaturaDetalles, BindingResult bindingResult, Model modelo, RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            modelo.addAttribute("mensajeError", "Hay errores en el formulario. Por favor, corrígelos.");
            return "Administrador/html/Asignatura/EditarAsignatura";
        }

        Asignatura asignaturaActualizada = asignaturaService.actualizar(id, asignaturaDetalles);
        if (asignaturaActualizada != null) {
            redirectAttributes.addFlashAttribute("mensaje", "Asignatura actualizada correctamente");
        } else {
            redirectAttributes.addFlashAttribute("error", "Error al actualizar asignatura");
        }
        return "redirect:/asignaturas/lista";
    }

    @PostMapping("/eliminar/{id}")
    public String eliminarAsignatura(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            asignaturaService.eliminar(id);
            redirectAttributes.addFlashAttribute("mensaje", "Asignatura eliminada correctamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al eliminar asignatura");
        }
        return "redirect:/asignaturas/lista";
    }
}