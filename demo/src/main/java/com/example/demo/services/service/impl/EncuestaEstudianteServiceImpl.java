package com.example.demo.services.service.impl;

import com.example.demo.model.entity.EncuestaEstudiante;
import com.example.demo.repositories.jpa.EncuestaEstudianteRepository;
import com.example.demo.services.service.EncuestaEstudianteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EncuestaEstudianteServiceImpl implements EncuestaEstudianteService {

    private final EncuestaEstudianteRepository encuestaRepository;

    @Override
    public EncuestaEstudiante guardarEncuesta(EncuestaEstudiante encuesta) {
        System.out.println("Guardando encuesta en servicio: " + encuesta); // Depuración
        if (encuesta.getEstudiante() == null || encuesta.getEstudiante().getIdEstudiante() == null) {
            throw new IllegalArgumentException("El estudiante no puede ser nulo al guardar la encuesta");
        }
        EncuestaEstudiante saved = encuestaRepository.save(encuesta);
        System.out.println("Encuesta guardada: " + saved); // Depuración
        return saved;
    }

    @Override
    public Optional<EncuestaEstudiante> obtenerPorId(Long id) {
        return encuestaRepository.findById(id);
    }

    @Override
    public Optional<EncuestaEstudiante> obtenerPorEstudianteId(Integer estudianteId) {
        System.out.println("Buscando encuesta para estudiante_id: " + estudianteId); // Depuración
        return encuestaRepository.findByEstudianteIdEstudiante(estudianteId);
    }

    @Override
    public List<EncuestaEstudiante> listarTodas() {
        return encuestaRepository.findAll();
    }

    @Override
    public EncuestaEstudiante actualizarEncuesta(Long id, EncuestaEstudiante encuestaActualizada) {
        System.out.println("Actualizando encuesta con ID: " + id + ", datos recibidos: " + encuestaActualizada); // Depuración
        return encuestaRepository.findById(id).map(encuestaExistente -> {
            if (encuestaActualizada.getEstudiante() == null || encuestaActualizada.getEstudiante().getIdEstudiante() == null) {
                throw new IllegalArgumentException("El estudiante no puede ser nulo al actualizar la encuesta");
            }
            // Mantener el ID de la encuesta existente
            encuestaActualizada.setId(encuestaExistente.getId());
            // Asegurar que el estudiante no cambie accidentalmente (opcional, dependiendo de tu lógica)
            if (!encuestaExistente.getEstudiante().getIdEstudiante().equals(encuestaActualizada.getEstudiante().getIdEstudiante())) {
                System.out.println("Advertencia: intento de cambiar estudiante_id de " +
                        encuestaExistente.getEstudiante().getIdEstudiante() + " a " +
                        encuestaActualizada.getEstudiante().getIdEstudiante());
                // Puedes lanzar una excepción aquí si no permites cambiar el estudiante
                // throw new IllegalArgumentException("No se permite cambiar el estudiante asociado a la encuesta");
            }
            EncuestaEstudiante updated = encuestaRepository.save(encuestaActualizada);
            System.out.println("Encuesta actualizada: " + updated); // Depuración
            return updated;
        }).orElseThrow(() -> new RuntimeException("Encuesta no encontrada con ID: " + id));
    }

    @Override
    public void eliminarEncuesta(Long id) {
        System.out.println("Eliminando encuesta con ID: " + id); // Depuración
        encuestaRepository.deleteById(id);
    }
}