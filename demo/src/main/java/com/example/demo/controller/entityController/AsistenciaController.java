package com.example.demo.controller.entityController;

import com.example.demo.model.entity.Asistencia;
import com.example.demo.model.entity.Estudiante;
import com.example.demo.model.entity.NivelDetalleCurso;
import com.example.demo.repositories.jpa.AsistenciaRepository;
import com.example.demo.repositories.jpa.EstudianteRepository;
import com.example.demo.repositories.jpa.NivelDetalleCursoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/asistencia")
public class AsistenciaController {

    private static final Logger logger = LoggerFactory.getLogger(AsistenciaController.class);

    @Autowired
    private AsistenciaRepository asistenciaRepository;

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Autowired
    private NivelDetalleCursoRepository nivelDetalleCursoRepository;

    @PostMapping("/registrar")
    public ResponseEntity<Asistencia> registrarOActualizarAsistencia(@RequestBody Asistencia asistencia) {
        try {
            logger.info("Recibiendo solicitud para registrar asistencia: {}", asistencia);

            // Resolver Estudiante
            Integer estudianteId = asistencia.getEstudiante().getIdEstudiante();
            Estudiante estudiante = estudianteRepository.findById(estudianteId)
                .orElseThrow(() -> {
                    logger.error("Estudiante no encontrado con ID: {}", estudianteId);
                    return new RuntimeException("Estudiante no encontrado con ID: " + estudianteId);
                });
            asistencia.setEstudiante(estudiante);
            logger.info("Estudiante resuelto: {}", estudiante);

            // Resolver NivelDetalleCurso
            Integer nivelDetalleCursoId = asistencia.getNivelDetalleCurso().getIdNivelDetalleCurso();
            NivelDetalleCurso nivelDetalleCurso = nivelDetalleCursoRepository.findById(nivelDetalleCursoId)
                .orElseThrow(() -> {
                    logger.error("NivelDetalleCurso no encontrado con ID: {}", nivelDetalleCursoId);
                    return new RuntimeException("NivelDetalleCurso no encontrado con ID: " + nivelDetalleCursoId);
                });
            asistencia.setNivelDetalleCurso(nivelDetalleCurso);
            logger.info("NivelDetalleCurso resuelto: {}", nivelDetalleCurso);

            // Asegurar que la fecha sea LocalDate
            LocalDate fecha = asistencia.getFecha();
            if (fecha == null) {
                logger.error("Fecha no proporcionada en la solicitud");
                throw new RuntimeException("Fecha es obligatoria");
            }
            logger.info("Fecha recibida: {}", fecha);

            // Verificar si ya existe una asistencia
            List<Asistencia> existingAsistencias = asistenciaRepository.findByEstudianteIdEstudianteAndFechaAndNivelDetalleCursoIdNivelDetalleCurso(
                estudiante.getIdEstudiante(), fecha, nivelDetalleCurso.getIdNivelDetalleCurso());
            logger.info("Asistencias existentes encontradas: {}", existingAsistencias.size());

            if (!existingAsistencias.isEmpty()) {
                // Tomar el registro más reciente (ordenado por fechaRegistro descendente)
                Asistencia asistenciaExistente = existingAsistencias.stream()
                    .sorted((a, b) -> b.getFechaRegistro().compareTo(a.getFechaRegistro()))
                    .findFirst()
                    .get();
                asistenciaExistente.setAsistio(asistencia.getAsistio());
                asistenciaExistente.setFechaRegistro(asistencia.getFechaRegistro() != null ? asistencia.getFechaRegistro() : asistenciaExistente.getFechaRegistro());
                Asistencia updatedAsistencia = asistenciaRepository.save(asistenciaExistente);
                logger.info("Asistencia actualizada: {}", updatedAsistencia);
                return ResponseEntity.ok(updatedAsistencia);
            } else {
                // Crear un nuevo registro
                asistencia.setFechaRegistro(asistencia.getFechaRegistro() != null ? asistencia.getFechaRegistro() : java.time.LocalDateTime.now());
                Asistencia savedAsistencia = asistenciaRepository.save(asistencia);
                logger.info("Asistencia creada: {}", savedAsistencia);
                return ResponseEntity.ok(savedAsistencia);
            }
        } catch (Exception e) {
            logger.error("Error al procesar la asistencia: {}", e.getMessage(), e);
            throw new RuntimeException("Error al procesar la asistencia: " + e.getMessage(), e);
        }
    }

    // Otros métodos (PUT y GET) permanecen iguales
    @PutMapping("/{id}")
    public ResponseEntity<Asistencia> actualizarAsistencia(@PathVariable Integer id, @RequestBody Asistencia asistencia) {
        Asistencia asistenciaExistente = asistenciaRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Asistencia no encontrada"));

        // Actualizar campos
        asistenciaExistente.setAsistio(asistencia.getAsistio());
        asistenciaExistente.setFecha(asistencia.getFecha());
        asistenciaExistente.setFechaRegistro(asistencia.getFechaRegistro() != null ? asistencia.getFechaRegistro() : asistenciaExistente.getFechaRegistro());

        Asistencia updatedAsistencia = asistenciaRepository.save(asistenciaExistente);
        return ResponseEntity.ok(updatedAsistencia);
    }

    @GetMapping("/curso/{idNivelDetalleCurso}")
    public ResponseEntity<List<Asistencia>> obtenerAsistenciasPorCurso(@PathVariable Integer idNivelDetalleCurso) {
        List<Asistencia> asistencias = asistenciaRepository.findByNivelDetalleCursoIdNivelDetalleCurso(idNivelDetalleCurso);
        return ResponseEntity.ok(asistencias);
    }
}