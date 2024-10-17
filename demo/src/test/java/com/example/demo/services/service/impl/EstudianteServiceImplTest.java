package com.example.demo.services.service.impl;

import com.example.demo.model.entity.Estudiante;
import com.example.demo.model.entity.dto.EstudianteDTO;
import com.example.demo.repositories.repository.EstudianteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class EstudianteServiceImplTest {

    @Mock
    private EstudianteRepository estudianteRepository;

    @InjectMocks
    private EstudianteServiceImpl estudianteService;

    private Estudiante estudiante1;
    private Estudiante estudiante2;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        estudiante1 = Estudiante.builder()
                .idEstudiante(1)
                .nombres("Juan")
                .apellidos("Pérez")
                .build();

        estudiante2 = Estudiante.builder()
                .idEstudiante(2)
                .nombres("María")
                .apellidos("Gómez")
                .build();
    }

    @Test
    void findAll() {
        // Configurar el comportamiento del mock
        when(estudianteRepository.findAll()).thenReturn(Arrays.asList(estudiante1, estudiante2));


        List<EstudianteDTO> estudiantesDTO = estudianteService.findAll();

        assertEquals(2, estudiantesDTO.size());
        assertEquals("Juan", estudiantesDTO.get(0).getNombres());
        assertEquals("María", estudiantesDTO.get(1).getNombres());
    }

    @Test
    void findById_ExistingId_ReturnsEstudianteDTO() {
        when(estudianteRepository.findById(1)).thenReturn(Optional.of(estudiante1));

        Optional<EstudianteDTO> estudianteDTO = estudianteService.findById(1);

        assertEquals("Juan", estudianteDTO.get().getNombres());
    }

    @Test
    void findById_NonExistingId_ReturnsEmpty() {
        when(estudianteRepository.findById(99)).thenReturn(Optional.empty());

        Optional<EstudianteDTO> estudianteDTO = estudianteService.findById(99);

        assertEquals(Optional.empty(), estudianteDTO);
    }

    @Test
    void save_CreatesNewEstudiante() {
        EstudianteDTO estudianteDTO = EstudianteDTO.builder()
                .nombres("Carlos")
                .apellidos("Lopez")
                .build();

        Estudiante estudiante = convertToEntity(estudianteDTO);

        when(estudianteRepository.save(estudiante)).thenReturn(estudiante);

        EstudianteDTO savedEstudianteDTO = estudianteService.save(estudianteDTO);

        assertEquals("Carlos", savedEstudianteDTO.getNombres());
    }

    @Test
    void deleteById_ExistingId_DeletesEstudiante() {
        estudianteService.deleteById(1);

        verify(estudianteRepository).deleteById(1);
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
