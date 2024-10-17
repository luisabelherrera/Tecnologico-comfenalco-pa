package com.example.demo.services.service.impl;

import com.example.demo.model.entity.NivelDetalle;
import com.example.demo.repositories.repository.NivelDetalleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class NivelDetalleServiceImplTest {

    @InjectMocks
    private NivelDetalleServiceImpl nivelDetalleService;

    @Mock
    private NivelDetalleRepository nivelDetalleRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void findAll() {
        List<NivelDetalle> nivelDetalles = new ArrayList<>();
        nivelDetalles.add(new NivelDetalle());
        nivelDetalles.add(new NivelDetalle());

        when(nivelDetalleRepository.findAll()).thenReturn(nivelDetalles);

        List<NivelDetalle> result = nivelDetalleService.findAll();

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(nivelDetalleRepository, times(1)).findAll();
    }

    @Test
    void findById() {
        NivelDetalle nivelDetalle = new NivelDetalle();
        when(nivelDetalleRepository.findById(1)).thenReturn(Optional.of(nivelDetalle));

        Optional<NivelDetalle> result = nivelDetalleService.findById(1);

        assertTrue(result.isPresent());
        assertEquals(nivelDetalle, result.get());
        verify(nivelDetalleRepository, times(1)).findById(1);
    }

    @Test
    void save() {
        NivelDetalle nivelDetalle = new NivelDetalle();
        when(nivelDetalleRepository.save(any(NivelDetalle.class))).thenReturn(nivelDetalle);

        NivelDetalle result = nivelDetalleService.save(nivelDetalle);

        assertNotNull(result);
        verify(nivelDetalleRepository, times(1)).save(nivelDetalle);
    }

    @Test
    void deleteById() {
        nivelDetalleService.deleteById(1);
        verify(nivelDetalleRepository, times(1)).deleteById(1);
    }
}
