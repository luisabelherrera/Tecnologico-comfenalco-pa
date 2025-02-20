package com.example.demo.services.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.stream.Collectors;

import com.example.demo.model.entity.Acudiente;
import com.example.demo.model.entity.dto.AcudienteDTO;
import com.example.demo.repositories.jpa.AcudienteRepository;
import com.example.demo.services.service.AcudienteService;

@Service
public class AcudienteServiceImpl implements AcudienteService {

    @Autowired
    private AcudienteRepository acudienteRepository;

    @Cacheable("acudientecache")
    public Page<AcudienteDTO> findAll(Pageable pageable) {
        System.out.println("Llamando a acudientecache y almacenando en caché.");
        return acudienteRepository.findAll(pageable).map(this::convertToDTO);
    }

    @Override
    public Page<AcudienteDTO> findByFilters(String nombres, String documentoIdentidad, Pageable pageable) {
        if ((nombres == null || nombres.isEmpty()) && (documentoIdentidad == null || documentoIdentidad.isEmpty())) {
            return acudienteRepository.findAll(pageable).map(this::convertToDTO);
        }
        return acudienteRepository.findByNombresContainingIgnoreCaseOrDocumentoIdentidadContainingIgnoreCase(
                nombres, documentoIdentidad, pageable).map(this::convertToDTO);
    }

    @Override
    public Optional<AcudienteDTO> findById(long idAcudiente) {
        return acudienteRepository.findById((int) idAcudiente)
                .map(this::convertToDTO);
    }

    @CacheEvict(value = "acudientecache", allEntries = true)
    public AcudienteDTO save(AcudienteDTO acudienteDTO) {
        Acudiente acudiente = convertToEntity(acudienteDTO);
        return convertToDTO(acudienteRepository.save(acudiente));
    }

    @CacheEvict(value = "acudientecache", allEntries = true)
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
