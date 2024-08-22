package com.example.demo.services;

import com.example.demo.model.entities.AñoEscolar;


import java.util.Optional;

public interface AñoEscolarService {
    Iterable<AñoEscolar> listar();
    Optional<AñoEscolar> obtenerPorId(Long id);
    AñoEscolar crear(AñoEscolar añoEscolar);
      AñoEscolar actualizar(Long id, AñoEscolar añoEscolarDetalles);
     void eliminar(Long id);
}