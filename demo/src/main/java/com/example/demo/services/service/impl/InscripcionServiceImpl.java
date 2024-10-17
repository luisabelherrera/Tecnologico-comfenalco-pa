package com.example.demo.services.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.Inscripcion;
import com.example.demo.model.entity.NivelDetalle;
import com.example.demo.repositories.repository.InscripcionRepository;
import com.example.demo.repositories.repository.NivelDetalleRepository;
import com.example.demo.services.service.InscripcionService;

@Service
public class InscripcionServiceImpl implements InscripcionService {

    @Autowired
    private InscripcionRepository inscripcionRepository;
    @Autowired
    private NivelDetalleRepository nivelDetalleRepository;

    @Override
    public List<Inscripcion> findAll() {
        return inscripcionRepository.findAll();
    }

    @Override
    public Optional<Inscripcion> findById(Integer id) {
        return inscripcionRepository.findById(id);
    }

    @Override
    public Inscripcion save(Inscripcion inscripcion) {
       if (inscripcion.getAcudiente() == null) {
            throw new IllegalArgumentException("El acudiente no puede ser nulo.");
        }

        Optional<Inscripcion> inscripcionExistente = inscripcionRepository.findById(inscripcion.getIdInscripcion());

        if (inscripcionExistente.isPresent()) {
             Inscripcion inscripcionAnterior = inscripcionExistente.get();
            NivelDetalle nivelAnterior = inscripcionAnterior.getNivelDetalle();
            NivelDetalle nivelNuevo = inscripcion.getNivelDetalle();

            if (!nivelAnterior.equals(nivelNuevo)) {
                if (nivelNuevo.getVacantesDisponibles() <= 0) {
                    throw new IllegalStateException("No hay vacantes disponibles en el nuevo nivel.");
                }

               nivelAnterior.setVacantesOcupadas(nivelAnterior.getVacantesOcupadas() - 1);
                nivelAnterior.setVacantesDisponibles(nivelAnterior.getVacantesDisponibles() + 1);
                nivelDetalleRepository.save(nivelAnterior);

               nivelNuevo.setVacantesOcupadas(nivelNuevo.getVacantesOcupadas() + 1);
                nivelNuevo.setVacantesDisponibles(nivelNuevo.getVacantesDisponibles() - 1);
                nivelDetalleRepository.save(nivelNuevo);
            }
        } else {
           NivelDetalle nivelDetalle = inscripcion.getNivelDetalle();

            if (nivelDetalle.getVacantesDisponibles() <= 0) {
                throw new IllegalStateException("No hay vacantes disponibles en este nivel.");
            }

            nivelDetalle.setVacantesOcupadas(nivelDetalle.getVacantesOcupadas() + 1);
            nivelDetalle.setVacantesDisponibles(nivelDetalle.getVacantesDisponibles() - 1);
            nivelDetalleRepository.save(nivelDetalle);
        }

        return inscripcionRepository.save(inscripcion);
    }

    @Override
    public void deleteById(Integer id) {
        Optional<Inscripcion> optionalInscripcion = inscripcionRepository.findById(id);

        if (optionalInscripcion.isPresent()) {
            Inscripcion inscripcion = optionalInscripcion.get();
            NivelDetalle nivelDetalle = inscripcion.getNivelDetalle();

            if (nivelDetalle.getVacantesOcupadas() > 0) {
                nivelDetalle.setVacantesOcupadas(nivelDetalle.getVacantesOcupadas() - 1);
            } else {
                throw new IllegalStateException("No hay vacantes ocupadas para descontar.");
            }

            if (nivelDetalle.getVacantesDisponibles() < nivelDetalle.getTotalVacantes()) {
                nivelDetalle.setVacantesDisponibles(nivelDetalle.getVacantesDisponibles() + 1);
            } else {
                throw new IllegalStateException("Las vacantes disponibles ya están al máximo.");
            }

            nivelDetalleRepository.save(nivelDetalle);

            inscripcionRepository.deleteById(id);
        } else {
            throw new IllegalStateException("La inscripción con el ID " + id + " no existe.");
        }
    }
}
