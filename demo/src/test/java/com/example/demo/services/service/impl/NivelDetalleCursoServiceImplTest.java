package com.example.demo.services.service.impl;

import com.example.demo.model.entity.NivelDetalleCurso;
import com.example.demo.repositories.repository.NivelDetalleCursoRepository;
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

class NivelDetalleCursoServiceImplTest {

    @InjectMocks
    private NivelDetalleCursoServiceImpl nivelDetalleCursoService;

    @Mock
    private NivelDetalleCursoRepository nivelDetalleCursoRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void findAll() {
        List<NivelDetalleCurso> nivelDetalleCursos = new ArrayList<>();
        nivelDetalleCursos.add(new NivelDetalleCurso());
        nivelDetalleCursos.add(new NivelDetalleCurso());

        when(nivelDetalleCursoRepository.findAll()).thenReturn(nivelDetalleCursos);

        List<NivelDetalleCurso> result = nivelDetalleCursoService.findAll();

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(nivelDetalleCursoRepository, times(1)).findAll();
    }

    @Test
    void findById() {
        NivelDetalleCurso nivelDetalleCurso = new NivelDetalleCurso();
        when(nivelDetalleCursoRepository.findById(1)).thenReturn(Optional.of(nivelDetalleCurso));

        Optional<NivelDetalleCurso> result = nivelDetalleCursoService.findById(1);

        assertTrue(result.isPresent());
        assertEquals(nivelDetalleCurso, result.get());
        verify(nivelDetalleCursoRepository, times(1)).findById(1);
    }

    @Test
    void save() {
        NivelDetalleCurso nivelDetalleCurso = new NivelDetalleCurso();
        when(nivelDetalleCursoRepository.save(any(NivelDetalleCurso.class))).thenReturn(nivelDetalleCurso);

        NivelDetalleCurso result = nivelDetalleCursoService.save(nivelDetalleCurso);

        assertNotNull(result);
        verify(nivelDetalleCursoRepository, times(1)).save(nivelDetalleCurso);
    }

    @Test
    void deleteById() {
        nivelDetalleCursoService.deleteById(1);
        verify(nivelDetalleCursoRepository, times(1)).deleteById(1);
    }
}
