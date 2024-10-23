package com.example.demo.services.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.example.demo.model.entity.dto.AcudienteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.Acudiente;
import com.example.demo.repositories.repository.AcudienteRepository;
import com.example.demo.services.service.AcudienteService;

@Service
public class AcudienteServiceImpl implements AcudienteService {

    @Autowired
    private AcudienteRepository acudienteRepository;

    
    @Override
    public List<AcudienteDTO> findAll() {
        return acudienteRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<AcudienteDTO> findById(long idAcudiente) {
        return acudienteRepository.findById((int) idAcudiente)
                .map(this::convertToDTO);
    }

    @Override
    public AcudienteDTO save(AcudienteDTO acudienteDTO) {
        Acudiente acudiente = convertToEntity(acudienteDTO);
        return convertToDTO(acudienteRepository.save(acudiente));
    }

    @Override
    public void deleteById(long idAcudiente) {
        acudienteRepository.deleteById((int) idAcudiente);
    }

    private AcudienteDTO convertToDTO(Acudiente acudiente) {
        return AcudienteDTO.builder()
                .idAcudiente(acudiente.getIdAcudiente())
                .parentesco(acudiente.getParentesco())
                .nombres(acudiente.getNombres())
                .apellidos(acudiente.getApellidos())
                .documentoIdentidad(acudiente.getDocumentoIdentidad())
                .fechaNacimiento(acudiente.getFechaNacimiento())
                .sexo(acudiente.getSexo())
                .estadoCivil(acudiente.getEstadoCivil())
                .ciudad(acudiente.getCiudad())
                .direccion(acudiente.getDireccion())
                .activo(acudiente.isActivo())
                .fechaRegistro(acudiente.getFechaRegistro())
                .build();
    }

    private Acudiente convertToEntity(AcudienteDTO dto) {
        return Acudiente.builder()
                .idAcudiente(dto.getIdAcudiente())
                .parentesco(dto.getParentesco())
                .nombres(dto.getNombres())
                .apellidos(dto.getApellidos())
                .documentoIdentidad(dto.getDocumentoIdentidad())
                .fechaNacimiento(dto.getFechaNacimiento())
                .sexo(dto.getSexo())
                .estadoCivil(dto.getEstadoCivil())
                .ciudad(dto.getCiudad())
                .direccion(dto.getDireccion())
                .activo(dto.isActivo())
                .fechaRegistro(dto.getFechaRegistro())
                .build();
    }
}