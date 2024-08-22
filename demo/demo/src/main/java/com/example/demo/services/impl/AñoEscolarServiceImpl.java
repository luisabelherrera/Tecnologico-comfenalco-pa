package com.example.demo.services.impl;


import com.example.demo.model.entities.AñoEscolar;
import com.example.demo.repositories.AñoEscolarRepository;
import com.example.demo.services.AñoEscolarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.Optional;

@Service
public class AñoEscolarServiceImpl implements AñoEscolarService {


    private final AñoEscolarRepository añoEscolarRepository;

    @Autowired
    public AñoEscolarServiceImpl(AñoEscolarRepository añoEscolarRepository) {
        this.añoEscolarRepository = añoEscolarRepository;
    }

    @Override
    public Iterable<AñoEscolar> listar() {
        return añoEscolarRepository.findAll();
    }

    @Override
    public Optional<AñoEscolar> obtenerPorId(Long id) {
        return añoEscolarRepository.findById(id);
    }

    @Override
    public AñoEscolar crear(AñoEscolar añoEscolar) {
        return añoEscolarRepository.save(añoEscolar);
    }

    @Override
    public AñoEscolar actualizar(Long id, AñoEscolar añoEscolarDetalles) {
        Optional<AñoEscolar> optionalAñoEscolar = añoEscolarRepository.findById(id);
        if (optionalAñoEscolar.isPresent()) {
            AñoEscolar añoEscolarExistente = optionalAñoEscolar.get();
            añoEscolarExistente.setNombre(añoEscolarDetalles.getNombre());
            añoEscolarExistente.setFechaInicio(añoEscolarDetalles.getFechaInicio());
            añoEscolarExistente.setFechaFin(añoEscolarDetalles.getFechaFin());
            añoEscolarExistente.setPeriodos(añoEscolarDetalles.getPeriodos());
            return añoEscolarRepository.save(añoEscolarExistente);
        } else {
            return null;
        }
    }

    @Override
    public void eliminar(Long id) {
        añoEscolarRepository.deleteById(id);
    }
}