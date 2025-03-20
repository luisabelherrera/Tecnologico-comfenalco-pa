package com.example.demo.services.service; // Ajusta si usas otro paquete

import com.example.demo.model.entity.DesempenoEstudiante;
import java.util.List;
import java.util.Optional;

public interface DesempenoEstudianteService {
    DesempenoEstudiante save(DesempenoEstudiante desempenoEstudiante);
    Optional<DesempenoEstudiante> findById(Integer id);
    List<DesempenoEstudiante> findAll();
    DesempenoEstudiante update(Integer id, DesempenoEstudiante desempenoEstudiante);
    void deleteById(Integer id);
}