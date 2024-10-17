package com.example.demo.services.service.impl;

import com.example.demo.model.entity.GradoSeccion;
import com.example.demo.repositories.repository.GradoSeccionRepository;
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

class GradoSeccionServiceImplTest {

    @Mock
    private GradoSeccionRepository gradoSeccionRepository;

    @InjectMocks
    private GradoSeccionServiceImpl gradoSeccionService;

    private GradoSeccion gradoSeccion;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        gradoSeccion = new GradoSeccion();
        gradoSeccion.setIdGradoSeccion(1);
   }

    @Test
    void findAll() {
        List<GradoSeccion> gradoSecciones = Arrays.asList(gradoSeccion);
        when(gradoSeccionRepository.findAll()).thenReturn(gradoSecciones);

        List<GradoSeccion> result = gradoSeccionService.findAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(gradoSeccionRepository, times(1)).findAll();
    }

    @Test
    void findById() {
        when(gradoSeccionRepository.findById(1)).thenReturn(Optional.of(gradoSeccion));

        Optional<GradoSeccion> result = gradoSeccionService.findById(1);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getIdGradoSeccion());
        verify(gradoSeccionRepository, times(1)).findById(1);
    }

    @Test
    void save() {
        when(gradoSeccionRepository.save(any(GradoSeccion.class))).thenReturn(gradoSeccion);

        GradoSeccion result = gradoSeccionService.save(gradoSeccion);

        assertNotNull(result);
        assertEquals(1, result.getIdGradoSeccion());
        verify(gradoSeccionRepository, times(1)).save(gradoSeccion);
    }

    @Test
    void deleteById() {
        doNothing().when(gradoSeccionRepository).deleteById(1);

        gradoSeccionService.deleteById(1);

        verify(gradoSeccionRepository, times(1)).deleteById(1);
    }
}
