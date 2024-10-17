package com.example.demo.services.service.impl;

import com.example.demo.model.entity.Inscripcion;
import com.example.demo.model.entity.NivelDetalle;
import com.example.demo.repositories.repository.InscripcionRepository;
import com.example.demo.repositories.repository.NivelDetalleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class InscripcionServiceImplTest {

    @Mock
    private InscripcionRepository inscripcionRepository;

    @Mock
    private NivelDetalleRepository nivelDetalleRepository;

    @InjectMocks
    private InscripcionServiceImpl inscripcionService;

    private Inscripcion inscripcion;
    private NivelDetalle nivelDetalle;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        nivelDetalle = new NivelDetalle();
        nivelDetalle.setVacantesDisponibles(5);
        nivelDetalle.setVacantesOcupadas(0);
        nivelDetalle.setTotalVacantes(10);

        inscripcion = new Inscripcion();
        inscripcion.setIdInscripcion(1);
        inscripcion.setNivelDetalle(nivelDetalle);
    }

    @Test
    void findAll() {
        when(inscripcionRepository.findAll()).thenReturn(Arrays.asList(inscripcion));

        var result = inscripcionService.findAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(inscripcionRepository, times(1)).findAll();
    }

    @Test
    void findById() {
        when(inscripcionRepository.findById(1)).thenReturn(Optional.of(inscripcion));

        var result = inscripcionService.findById(1);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getIdInscripcion());
        verify(inscripcionRepository, times(1)).findById(1);
    }

    @Test
    void save_withExistingInscription() {
        when(inscripcionRepository.findById(1)).thenReturn(Optional.of(inscripcion));
        when(nivelDetalleRepository.save(any(NivelDetalle.class))).thenReturn(nivelDetalle);
        when(inscripcionRepository.save(any(Inscripcion.class))).thenReturn(inscripcion);

        var result = inscripcionService.save(inscripcion);

        assertNotNull(result);
        verify(inscripcionRepository, times(1)).findById(1);
        verify(nivelDetalleRepository, times(2)).save(any(NivelDetalle.class));
        verify(inscripcionRepository, times(1)).save(inscripcion);
    }

    @Test
    void save_withNewInscription() {
        when(inscripcionRepository.findById(2)).thenReturn(Optional.empty());
        when(nivelDetalleRepository.save(any(NivelDetalle.class))).thenReturn(nivelDetalle);
        when(inscripcionRepository.save(any(Inscripcion.class))).thenReturn(inscripcion);

        inscripcion.setIdInscripcion(2);

        var result = inscripcionService.save(inscripcion);

        assertNotNull(result);
        verify(inscripcionRepository, times(1)).findById(2);
        verify(nivelDetalleRepository, times(1)).save(any(NivelDetalle.class));
        verify(inscripcionRepository, times(1)).save(inscripcion);
    }

    @Test
    void save_noAvailableVacants() {
         inscripcion.setAcudiente(null);

         Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            inscripcionService.save(inscripcion);
        });

        assertEquals("El acudiente no puede ser nulo.", exception.getMessage());
    }


    @Test
    void deleteById() {
        when(inscripcionRepository.findById(1)).thenReturn(Optional.of(inscripcion));
        when(nivelDetalleRepository.save(any(NivelDetalle.class))).thenReturn(nivelDetalle);

        inscripcionService.deleteById(1);

        verify(inscripcionRepository, times(1)).deleteById(1);
        verify(nivelDetalleRepository, times(1)).save(nivelDetalle);
    }

    @Test
    void deleteById_inscripcionNotFound() {
        when(inscripcionRepository.findById(1)).thenReturn(Optional.empty());

        Exception exception = assertThrows(IllegalStateException.class, () -> {
            inscripcionService.deleteById(1);
        });

        assertEquals("La inscripción con el ID 1 no existe.", exception.getMessage());
    }

    @Test
    void deleteById_noOccupiedVacancies() {
        nivelDetalle.setVacantesOcupadas(0);

        when(inscripcionRepository.findById(1)).thenReturn(Optional.of(inscripcion));

        Exception exception = assertThrows(IllegalStateException.class, () -> {
            inscripcionService.deleteById(1);
        });

        assertEquals("No hay vacantes ocupadas para descontar.", exception.getMessage());
    }
}
