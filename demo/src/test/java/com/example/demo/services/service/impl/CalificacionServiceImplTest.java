package com.example.demo.services.service.impl;

import com.example.demo.model.entity.Calificacion;
import com.example.demo.repositories.repository.CalificacionRepository;
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

class CalificacionServiceImplTest {

    @Mock
    private CalificacionRepository calificacionRepository;

    @InjectMocks
    private CalificacionServiceImpl calificacionService;

    private Calificacion calificacion;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        calificacion = new Calificacion();
        calificacion.setIdCalificacion(1);
        // Inicializa otros atributos según sea necesario
    }

    @Test
    void findAll() {
        List<Calificacion> calificaciones = Arrays.asList(calificacion);
        when(calificacionRepository.findAll()).thenReturn(calificaciones);

        List<Calificacion> result = calificacionService.findAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(calificacionRepository, times(1)).findAll();
    }

    @Test
    void findById() {
        when(calificacionRepository.findById(1)).thenReturn(Optional.of(calificacion));

        Optional<Calificacion> result = calificacionService.findById(1);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getIdCalificacion());
        verify(calificacionRepository, times(1)).findById(1);
    }

    @Test
    void save() {
        when(calificacionRepository.save(any(Calificacion.class))).thenReturn(calificacion);

        Calificacion result = calificacionService.save(calificacion);

        assertNotNull(result);
        assertEquals(1, result.getIdCalificacion());
        verify(calificacionRepository, times(1)).save(calificacion);
    }

    @Test
    void deleteById() {
        doNothing().when(calificacionRepository).deleteById(1);

        calificacionService.deleteById(1);

        verify(calificacionRepository, times(1)).deleteById(1);
    }
}
