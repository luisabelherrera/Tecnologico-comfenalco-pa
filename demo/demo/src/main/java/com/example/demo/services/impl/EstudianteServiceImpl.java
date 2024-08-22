package com.example.demo.services.impl;

import com.example.demo.model.entities.Estudiante;
import com.example.demo.repositories.EstudianteRepository;
import com.example.demo.services.EstudianteService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class  EstudianteServiceImpl  implements EstudianteService {

    private final EstudianteRepository estudianteRepository;

    @Autowired
    public EstudianteServiceImpl(EstudianteRepository estudianteRepository) {
        this.estudianteRepository = estudianteRepository;
    }

    @Override
    public Iterable<Estudiante> listar() {
        return estudianteRepository.findAll();
    }

    @Override
    public Optional<Estudiante> obtenerPorId(Long id) {
        return estudianteRepository.findById(id);
    }

    @Override
    @Transactional
    public Estudiante crear(Estudiante estudiante) {
        return estudianteRepository.save(estudiante);
    }

    @Override
    @Transactional
    public Estudiante actualizar(Long id, Estudiante estudianteDetalles) {
        Optional<Estudiante> optionalEstudiante = estudianteRepository.findById(id);
        if (optionalEstudiante.isPresent()) {
            Estudiante estudianteExistente = optionalEstudiante.get();
            estudianteExistente.setNombreCompleto(estudianteDetalles.getNombreCompleto());
            estudianteExistente.setFechaNacimiento(estudianteDetalles.getFechaNacimiento());
            estudianteExistente.setDireccion(estudianteDetalles.getDireccion());
            estudianteExistente.setTelefono(estudianteDetalles.getTelefono());
            estudianteExistente.setCorreoElectronico(estudianteDetalles.getCorreoElectronico());
            estudianteExistente.setGenero(estudianteDetalles.getGenero());
            estudianteExistente.setNacionalidad(estudianteDetalles.getNacionalidad());

            if (estudianteDetalles.getFotoDatos() != null) {
                estudianteExistente.setFotoDatos(estudianteDetalles.getFotoDatos());
                estudianteExistente.setFormatoFoto(estudianteDetalles.getFormatoFoto());
            }
            return estudianteRepository.save(estudianteExistente);
        }
        return null;
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        estudianteRepository.deleteById(id);
    }
}