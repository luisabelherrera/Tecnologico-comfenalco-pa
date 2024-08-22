package com.example.demo.services.impl;



import com.example.demo.model.entities.Profesor;
import com.example.demo.repositories.ProfesorRepository;

import com.example.demo.services.ProfesorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class ProfesorServiceImpl implements ProfesorService {


    private final ProfesorRepository profesorRepository;

    @Autowired
    public ProfesorServiceImpl(ProfesorRepository profesorRepository) {
        this.profesorRepository = profesorRepository;
    }

    @Override
    public Iterable<Profesor> listar() {
        return profesorRepository.findAll();
    }

    @Override
    public Profesor crear(Profesor profesor) {
        return profesorRepository.save(profesor);
    }

    @Override
    public Optional<Profesor> obtenerPorId(Long id) {
        return profesorRepository.findById(id);
    }

    @Override
    public Profesor actualizar(Long id, Profesor profesorDetalles) {
        Optional<Profesor> optionalProfesor = profesorRepository.findById(id);
        if (optionalProfesor.isPresent()) {
            Profesor profesor = optionalProfesor.get();
            profesor.setNombreCompleto(profesorDetalles.getNombreCompleto());
            profesor.setFechaNacimiento(profesorDetalles.getFechaNacimiento());
            profesor.setDireccion(profesorDetalles.getDireccion());
            profesor.setTelefono(profesorDetalles.getTelefono());
            profesor.setCorreoElectronico(profesorDetalles.getCorreoElectronico());
            profesor.setGenero(profesorDetalles.getGenero());
            profesor.setNacionalidad(profesorDetalles.getNacionalidad());
            return profesorRepository.save(profesor);
        } else {
            throw new IllegalArgumentException("El profesor con ID " + id + " no existe.");
        }
    }

    @Override
    public void eliminar(Long id) {
        profesorRepository.deleteById(id);
    }

    @Override
    public List<Profesor> filtrarPorNombre(String nombreCompleto) {
        return profesorRepository.findByNombreCompletoContaining(nombreCompleto);
    }
}