package com.example.demo.services.service.impl;

import com.example.demo.model.entity.DocenteNivelDetalleCurso;
import com.example.demo.repositories.repository.DocenteNivelDetalleCursoRepository;
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

class DocenteNivelDetalleCursoServiceImplTest {

    @Mock
    private DocenteNivelDetalleCursoRepository docenteNivelDetalleCursoRepository;

    @InjectMocks
    private DocenteNivelDetalleCursoServiceImpl docenteNivelDetalleCursoService;

    private DocenteNivelDetalleCurso docenteNivelDetalleCurso;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        docenteNivelDetalleCurso = new DocenteNivelDetalleCurso();
        docenteNivelDetalleCurso.setIdDocenteNivelDetalleCurso(1);
    }

    @Test
    void findAll() {
        List<DocenteNivelDetalleCurso> cursos = Arrays.asList(docenteNivelDetalleCurso);
        when(docenteNivelDetalleCursoRepository.findAll()).thenReturn(cursos);

        List<DocenteNivelDetalleCurso> result = docenteNivelDetalleCursoService.findAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(docenteNivelDetalleCursoRepository, times(1)).findAll();
    }

    @Test
    void findById() {
        when(docenteNivelDetalleCursoRepository.findById(1)).thenReturn(Optional.of(docenteNivelDetalleCurso));

        Optional<DocenteNivelDetalleCurso> result = docenteNivelDetalleCursoService.findById(1);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getIdDocenteNivelDetalleCurso());
        verify(docenteNivelDetalleCursoRepository, times(1)).findById(1);
    }

    @Test
    void save() {
        when(docenteNivelDetalleCursoRepository.save(any(DocenteNivelDetalleCurso.class))).thenReturn(docenteNivelDetalleCurso);

        DocenteNivelDetalleCurso result = docenteNivelDetalleCursoService.save(docenteNivelDetalleCurso);

        assertNotNull(result);
        assertEquals(1, result.getIdDocenteNivelDetalleCurso());
        verify(docenteNivelDetalleCursoRepository, times(1)).save(docenteNivelDetalleCurso);
    }

    @Test
    void deleteById() {
        doNothing().when(docenteNivelDetalleCursoRepository).deleteById(1);

        docenteNivelDetalleCursoService.deleteById(1);

        verify(docenteNivelDetalleCursoRepository, times(1)).deleteById(1);
    }
}
