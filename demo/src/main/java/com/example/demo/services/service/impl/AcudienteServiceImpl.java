package com.example.demo.services.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.demo.model.entity.Acudiente;
import com.example.demo.model.entity.dto.AcudienteDTO;
import com.example.demo.repositories.jpa.AcudienteRepository;
import com.example.demo.services.service.AcudienteService;

import java.util.Optional;

@Service
public class AcudienteServiceImpl implements AcudienteService {

    @Autowired
    private AcudienteRepository acudienteRepository;

    @Override
    @Cacheable("acudientecache")
    public Page<AcudienteDTO> findAll(Pageable pageable) {
        System.out.println("Llamando a acudientecache y almacenando en caché.");
        return acudienteRepository.findAll(pageable).map(this::convertToDTO);
    }

    @Override
    public Page<AcudienteDTO> findByFilters(String nombres, String documentoIdentidad, String parentesco, String ciudad, Boolean activo, Pageable pageable) {
        Specification<Acudiente> spec = Specification.where(null);
    
        if (nombres != null && !nombres.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("nombres")), "%" + nombres.toLowerCase() + "%"));
        }
        if (documentoIdentidad != null && !documentoIdentidad.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(root.get("documentoIdentidad"), "%" + documentoIdentidad + "%"));
        }
        if (parentesco != null && !parentesco.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("parentesco"), parentesco));
        }
        if (ciudad != null && !ciudad.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("ciudad"), ciudad));
        }
        if (activo != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("activo"), activo));
        }
    
        Page<AcudienteDTO> result = acudienteRepository.findAll(spec, pageable).map(this::convertToDTO);
        System.out.println("Page requested: " + pageable.getPageNumber() + ", Size: " + pageable.getPageSize() + ", Total Elements: " + result.getTotalElements());
        return result;
    }
    @Override
    public Optional<AcudienteDTO> findById(long idAcudiente) {
        return acudienteRepository.findById((int) idAcudiente).map(this::convertToDTO);
    }

    @Override
    @CacheEvict(value = "acudientecache", allEntries = true)
    public AcudienteDTO save(AcudienteDTO acudienteDTO) {
        Acudiente acudiente = convertToEntity(acudienteDTO);
        return convertToDTO(acudienteRepository.save(acudiente));
    }

    @Override
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
                .email(acudiente.getEmail())
                .activo(acudiente.isActivo())
                .telefono(acudiente.getTelefono())

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
                .email(dto.getEmail())
                .telefono(dto.getTelefono())
                .activo(dto.isActivo())
                .fechaRegistro(dto.getFechaRegistro())
                .build();
    }
}