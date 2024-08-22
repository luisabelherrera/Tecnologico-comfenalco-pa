package com.example.demo.services.impl;

import com.example.demo.model.entities.Asignatura;
import com.example.demo.repositories.AsignaturaRepository;
import com.example.demo.services.AsignaturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class AsignaturaServiceImpl implements AsignaturaService {

    @Autowired
    private AsignaturaRepository asignaturaRepository;

    @Override
    public Iterable<Asignatura> listar() {
        return asignaturaRepository.findAll();
    }

    @Override
    public Optional<Asignatura> obtenerPorId(Long id) {
        return asignaturaRepository.findById(id);
    }

    @Override
    public Asignatura crear(Asignatura asignatura) {
       Optional<Asignatura> existingAsignatura = asignaturaRepository.findById(Long.valueOf(asignatura.getCodigo()));
        if (existingAsignatura.isPresent()) {
            throw new DuplicateDataException("El código de asignatura ya existe: " + asignatura.getCodigo());
        }
        return asignaturaRepository.save(asignatura);
    }
    public class DuplicateDataException extends RuntimeException {
        public DuplicateDataException(String message) {
            super(message);
        }
    }


    @Override
    public Asignatura actualizar(Long id, Asignatura asignaturaDetalles) {
        Optional<Asignatura> optionalAsignatura = asignaturaRepository.findById(id);
        if (optionalAsignatura.isPresent()) {
            Asignatura asignaturaExistente = optionalAsignatura.get();

            asignaturaExistente.setNombre(asignaturaDetalles.getNombre());
            asignaturaExistente.setCodigo(asignaturaDetalles.getCodigo());
            asignaturaExistente.setDescripcion(asignaturaDetalles.getDescripcion());
            asignaturaExistente.setCreditos(asignaturaDetalles.getCreditos());

            return asignaturaRepository.save(asignaturaExistente);
        } else {
            return null;
        }
    }

    @Override
    public void eliminar(Long id) {
        asignaturaRepository.deleteById(id);
    }

    @Override
    public Optional<Asignatura> obtenerPorCodigo(String codigo) {
        return asignaturaRepository.findById(Long.valueOf(codigo));
    }
}