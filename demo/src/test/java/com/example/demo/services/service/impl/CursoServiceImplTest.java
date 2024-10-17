package com.example.demo.services.service.impl;

import com.example.demo.model.entity.Curso;
import com.example.demo.repositories.repository.CursoRepository;
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

class CursoServiceImplTest {

    @Mock
    private CursoRepository cursoRepository;

    @InjectMocks
    private CursoServiceImpl cursoService;

    private Curso curso;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        curso = new Curso();
        curso.setIdCurso(1);
        curso.setDescripcion("Matemáticas");
   }

    @Test
    void findAll() {
        List<Curso> cursos = Arrays.asList(curso);
        when(cursoRepository.findAll()).thenReturn(cursos);

        List<Curso> result = cursoService.findAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(cursoRepository, times(1)).findAll();
    }

    @Test
    void findById() {
        when(cursoRepository.findById(1)).thenReturn(Optional.of(curso));

        Optional<Curso> result = cursoService.findById(1);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getIdCurso());
        verify(cursoRepository, times(1)).findById(1);
    }

    @Test
    void save() {
        when(cursoRepository.save(any(Curso.class))).thenReturn(curso);

        Curso result = cursoService.save(curso);

        assertNotNull(result);
        assertEquals(1, result.getIdCurso());
        assertEquals("Matemáticas", result.getDescripcion());
        verify(cursoRepository, times(1)).save(curso);
    }

    @Test
    void deleteById() {
        doNothing().when(cursoRepository).deleteById(1);

        cursoService.deleteById(1);

        verify(cursoRepository, times(1)).deleteById(1);
    }
}
