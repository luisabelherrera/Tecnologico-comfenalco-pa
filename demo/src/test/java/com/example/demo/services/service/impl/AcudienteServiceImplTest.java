package com.example.demo.services.service.impl;

import com.example.demo.model.entity.Acudiente;
import com.example.demo.model.entity.dto.AcudienteDTO;
import com.example.demo.repositories.repository.AcudienteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AcudienteServiceImplTest {

    @Mock
    private AcudienteRepository acudienteRepository;

    @InjectMocks
    private AcudienteServiceImpl acudienteService;

    private Acudiente acudiente1;
    private Acudiente acudiente2;
    private AcudienteDTO acudienteDTO1;
    private AcudienteDTO acudienteDTO2;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        acudiente1 = Acudiente.builder()
                .idAcudiente(1L)
                .nombres("Juan")
                .apellidos("Perez")
                .documentoIdentidad("123456789")
                .activo(true)
                .build();

        acudiente2 = Acudiente.builder()
                .idAcudiente(2L)
                .nombres("Maria")
                .apellidos("Lopez")
                .documentoIdentidad("987654321")
                .activo(true)
                .build();

        acudienteDTO1 = AcudienteDTO.builder()
                .idAcudiente(1L)
                .nombres("Juan")
                .apellidos("Perez")
                .documentoIdentidad("123456789")
                .activo(true)
                .build();

        acudienteDTO2 = AcudienteDTO.builder()
                .idAcudiente(2L)
                .nombres("Maria")
                .apellidos("Lopez")
                .documentoIdentidad("987654321")
                .activo(true)
                .build();
    }

    @Test
    void findAll() {
        List<Acudiente> acudientes = Arrays.asList(acudiente1, acudiente2);
        when(acudienteRepository.findAll()).thenReturn(acudientes);

        List<AcudienteDTO> result = acudienteService.findAll();

         assertEquals(2, result.size());
        verify(acudienteRepository, times(1)).findAll();
    }

    @Test
    void findById() {

        when(acudienteRepository.findById(1)).thenReturn(Optional.of(acudiente1));

        Optional<AcudienteDTO> result = acudienteService.findById(1L);

        assertTrue(result.isPresent());
        assertEquals("Juan", result.get().getNombres());
        verify(acudienteRepository, times(1)).findById(1);
    }

    @Test
    void save() {
        when(acudienteRepository.save(acudiente1)).thenReturn(acudiente1);

        AcudienteDTO result = acudienteService.save(acudienteDTO1);
        assertNotNull(result);
        assertEquals(1, result.getIdAcudiente());
        verify(acudienteRepository, times(1)).save(any(Acudiente.class));
    }

    @Test
    void deleteById() {
        acudienteService.deleteById(1L);

        verify(acudienteRepository, times(1)).deleteById(1);
    }
}
