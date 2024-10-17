package com.example.demo.services.service.impl;

import com.example.demo.model.entity.Nivel;
import com.example.demo.model.entity.Periodo;
import com.example.demo.repositories.repository.NivelRepository;
import com.example.demo.services.service.PeriodoService;
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
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

class NivelServiceImplTest {

    @InjectMocks
    private NivelServiceImpl nivelService;

    @Mock
    private NivelRepository nivelRepository;

    @Mock
    private PeriodoService periodoService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void findAll() {
        List<Nivel> niveles = new ArrayList<>();
        niveles.add(new Nivel());
        niveles.add(new Nivel());

        when(nivelRepository.findAll()).thenReturn(niveles);

        List<Nivel> result = nivelService.findAll();

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(nivelRepository, times(1)).findAll();
    }

    @Test
    void findById() {
        Nivel nivel = new Nivel();
        when(nivelRepository.findById(1)).thenReturn(Optional.of(nivel));

        Optional<Nivel> result = nivelService.findById(1);

        assertTrue(result.isPresent());
        assertEquals(nivel, result.get());
        verify(nivelRepository, times(1)).findById(1);
    }

    @Test
    void save_newPeriodo() {
        Nivel nivel = new Nivel();
        Periodo periodo = new Periodo();
        periodo.setIdPeriodo(1);
        nivel.setPeriodo(periodo);

        when(periodoService.findById(1)).thenReturn(Optional.empty());
        when(periodoService.save(any(Periodo.class))).thenReturn(periodo);
        when(nivelRepository.save(any(Nivel.class))).thenReturn(nivel);

        Nivel result = nivelService.save(nivel);

        assertNotNull(result);
        assertEquals(periodo, result.getPeriodo());
        verify(periodoService, times(1)).save(periodo);
        verify(nivelRepository, times(1)).save(nivel);
    }

    @Test
    void save_existingPeriodo() {
        Nivel nivel = new Nivel();
        Periodo periodo = new Periodo();
        periodo.setIdPeriodo(1);
        nivel.setPeriodo(periodo);

        when(periodoService.findById(1)).thenReturn(Optional.of(periodo));
        when(nivelRepository.save(any(Nivel.class))).thenReturn(nivel);

        Nivel result = nivelService.save(nivel);

        assertNotNull(result);
        assertEquals(periodo, result.getPeriodo());
        verify(periodoService, times(0)).save(any(Periodo.class));
        verify(nivelRepository, times(1)).save(nivel);
    }

    @Test
    void deleteById() {
        nivelService.deleteById(1);
        verify(nivelRepository, times(1)).deleteById(1);
    }
}
