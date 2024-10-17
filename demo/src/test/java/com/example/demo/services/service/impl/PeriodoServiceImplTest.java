package com.example.demo.services.service.impl;

import com.example.demo.model.entity.Periodo;
import com.example.demo.repositories.repository.PeriodoRepository;
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

class PeriodoServiceImplTest {

    @InjectMocks
    private PeriodoServiceImpl periodoService;

    @Mock
    private PeriodoRepository periodoRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void findAll() {
        List<Periodo> periodos = new ArrayList<>();
        periodos.add(new Periodo());
        periodos.add(new Periodo());

        when(periodoRepository.findAll()).thenReturn(periodos);

        List<Periodo> result = periodoService.findAll();

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(periodoRepository, times(1)).findAll();
    }

    @Test
    void findById() {
        Periodo periodo = new Periodo();
        when(periodoRepository.findById(1)).thenReturn(Optional.of(periodo));

        Optional<Periodo> result = periodoService.findById(1);

        assertTrue(result.isPresent());
        assertEquals(periodo, result.get());
        verify(periodoRepository, times(1)).findById(1);
    }

    @Test
    void save() {
        Periodo periodo = new Periodo();
        when(periodoRepository.save(any(Periodo.class))).thenReturn(periodo);

        Periodo result = periodoService.save(periodo);

        assertNotNull(result);
        verify(periodoRepository, times(1)).save(periodo);
    }

    @Test
    void deleteById() {
        periodoService.deleteById(1);
        verify(periodoRepository, times(1)).deleteById(1);
    }
}
