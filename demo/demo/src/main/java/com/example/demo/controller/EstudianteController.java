package com.example.demo.controller;


import com.example.demo.model.entities.Estudiante;
import com.example.demo.services.EstudianteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;


@Controller
@RequestMapping("/estudiantes")
public class EstudianteController {

    @Autowired
    private EstudianteService estudianteService;

     @GetMapping("/crear")
    public String mostrarFormularioCreacion(Model modelo) {
        modelo.addAttribute("estudiante", new Estudiante());
        return "Administrador/html/estudiantes/agregar";
    }

    @PostMapping("/crear")
    public RedirectView crearEstudiante(@ModelAttribute @Valid Estudiante estudiante,
                                        @RequestParam("foto") MultipartFile file,
                                        RedirectAttributes redirectAttributes) {
        try {
            if (!file.isEmpty()) {
              byte[] fotoDatos = file.getBytes();

             estudiante.setFotoDatos(fotoDatos);
              estudiante.setFormatoFoto(file.getContentType().split("/")[1]);
            }

            estudianteService.crear(estudiante);
            redirectAttributes.addFlashAttribute("mensaje", "Estudiante registrado correctamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al crear estudiante: " + e.getMessage());
        }
        return new RedirectView("/estudiantes/lista");
    }


    @GetMapping("/lista")
    public String lista(Model modelo) {
        Iterable<Estudiante> estudiantes = estudianteService.listar();
        modelo.addAttribute("estudiantes", estudiantes);
        return "Administrador/html/estudiantes/lista";
    }


    @GetMapping("/foto/{id}")
    public ResponseEntity<byte[]> mostrarFoto(@PathVariable Long id) {
        Estudiante estudiante = estudianteService.obtenerPorId(id).orElse(null);
        if (estudiante != null && estudiante.getFotoDatos() != null) {
            MediaType mediaType = MediaType.valueOf("image/" + estudiante.getFormatoFoto());
            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .body(estudiante.getFotoDatos());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/actualizar/{id}")
    public String mostrarFormularioActualizacion(@PathVariable Long id, Model modelo) {
        Estudiante estudiante = estudianteService.obtenerPorId(id).orElse(null);
        modelo.addAttribute("estudiante", estudiante);
        return "Administrador/html/estudiantes/modificar";
    }

    @PostMapping("/actualizar/{id}")
    public RedirectView actualizarEstudiante(@PathVariable Long id,
                                             @ModelAttribute @Valid Estudiante estudianteDetalles,
                                             @RequestParam("foto") MultipartFile file,
                                             RedirectAttributes redirectAttributes) {
        try {

            estudianteService.actualizar(id, estudianteDetalles);

            if (!file.isEmpty()) {
                estudianteDetalles.setFotoDatos(file.getBytes());
                estudianteDetalles.setFormatoFoto(file.getContentType().split("/")[1]);
                estudianteService.crear(estudianteDetalles);
            }

            redirectAttributes.addFlashAttribute("mensaje", "Estudiante actualizado correctamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al actualizar estudiante: " + e.getMessage());
        }
        return new RedirectView("/estudiantes/lista");
    }

    @PostMapping("/borrar/{id}")
    public RedirectView eliminarEstudiante(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            estudianteService.eliminar(id);
            redirectAttributes.addFlashAttribute("mensaje", "Estudiante eliminado correctamente");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error al eliminar estudiante");
        }
        return new RedirectView("/estudiantes/lista");
    }
}