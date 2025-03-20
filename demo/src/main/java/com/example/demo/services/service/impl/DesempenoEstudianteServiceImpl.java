package com.example.demo.services.service.impl;

import com.example.demo.model.entity.DesempenoEstudiante;
import com.example.demo.repositories.jpa.DesempenoEstudianteRepository; // Debe coincidir con el paquete del repositorio
import com.example.demo.services.service.DesempenoEstudianteService; // Ajusta el paquete del interfaz
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DesempenoEstudianteServiceImpl implements DesempenoEstudianteService {

    @Autowired
    private DesempenoEstudianteRepository repository;

    @Override
    public DesempenoEstudiante save(DesempenoEstudiante desempenoEstudiante) {
        return repository.save(desempenoEstudiante);
    }

    @Override
    public Optional<DesempenoEstudiante> findById(Integer id) {
        return repository.findById(id);
    }

    @Override
    public List<DesempenoEstudiante> findAll() {
        return repository.findAll();
    }

    @Override
    public DesempenoEstudiante update(Integer id, DesempenoEstudiante desempenoEstudiante) {
        Optional<DesempenoEstudiante> existing = repository.findById(id);
        if (existing.isPresent()) {
            DesempenoEstudiante toUpdate = existing.get();
            toUpdate.setEstudiante(desempenoEstudiante.getEstudiante());
            toUpdate.setEdad(desempenoEstudiante.getEdad());
            toUpdate.setGenero(desempenoEstudiante.getGenero());
            toUpdate.setHorasEstudioSemanal(desempenoEstudiante.getHorasEstudioSemanal());
            toUpdate.setAsistencia(desempenoEstudiante.getAsistencia());
            toUpdate.setPromedioParciales(desempenoEstudiante.getPromedioParciales());
            toUpdate.setParticipacionClases(desempenoEstudiante.getParticipacionClases());
            toUpdate.setUsoPlataformaVirtual(desempenoEstudiante.getUsoPlataformaVirtual());
            toUpdate.setAntecedentesPerdida(desempenoEstudiante.getAntecedentesPerdida());
            toUpdate.setPerderaAsignatura(desempenoEstudiante.getPerderaAsignatura());
            return repository.save(toUpdate);
        }
        throw new RuntimeException("DesempenoEstudiante no encontrado con id: " + id);
    }

    @Override
    public void deleteById(Integer id) {
        repository.deleteById(id);
    }
}