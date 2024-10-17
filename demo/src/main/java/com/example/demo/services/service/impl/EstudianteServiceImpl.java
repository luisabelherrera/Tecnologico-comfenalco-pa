package com.example.demo.services.service.impl;

import com.example.demo.model.entity.dto.EstudianteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.Estudiante;
import com.example.demo.repositories.repository.EstudianteRepository;
import com.example.demo.services.service.EstudianteService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EstudianteServiceImpl implements EstudianteService {

    @Autowired
    private EstudianteRepository estudianteRepository;

    @Override
    public List<EstudianteDTO> findAll() {
        return estudianteRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<EstudianteDTO> findById(Integer id) {
        return estudianteRepository.findById(id).map(this::convertToDTO);
    }

    @Override
    public EstudianteDTO save(EstudianteDTO estudianteDTO) {
        Estudiante estudiante = convertToEntity(estudianteDTO);
        return convertToDTO(estudianteRepository.save(estudiante));
    }

    @Override
    public void deleteById(Integer id) {
        estudianteRepository.deleteById(id);
    }

    private EstudianteDTO convertToDTO(Estudiante estudiante) {
        return EstudianteDTO.builder()
                .idEstudiante(estudiante.getIdEstudiante())
                .valorCodigo(estudiante.getValorCodigo())
                .codigo(estudiante.getCodigo())
                .nombres(estudiante.getNombres())
                .apellidos(estudiante.getApellidos())
                .documentoIdentidad(estudiante.getDocumentoIdentidad())
                .fechaNacimiento(estudiante.getFechaNacimiento())
                .sexo(estudiante.getSexo())
                .ciudad(estudiante.getCiudad())
                .direccion(estudiante.getDireccion())
                .activo(estudiante.isActivo())
                .fechaRegistro(estudiante.getFechaRegistro())
                .build();
    }

    private Estudiante convertToEntity(EstudianteDTO estudianteDTO) {
        return Estudiante.builder()
                .idEstudiante(estudianteDTO.getIdEstudiante())
                .valorCodigo(estudianteDTO.getValorCodigo())
                .codigo(estudianteDTO.getCodigo())
                .nombres(estudianteDTO.getNombres())
                .apellidos(estudianteDTO.getApellidos())
                .documentoIdentidad(estudianteDTO.getDocumentoIdentidad())
                .fechaNacimiento(estudianteDTO.getFechaNacimiento())
                .sexo(estudianteDTO.getSexo())
                .ciudad(estudianteDTO.getCiudad())
                .direccion(estudianteDTO.getDireccion())
                .activo(estudianteDTO.isActivo())
                .fechaRegistro(estudianteDTO.getFechaRegistro())
                .build();
    }

}