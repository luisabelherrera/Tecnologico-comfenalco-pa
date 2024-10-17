package com.example.demo.services.service.impl;

import com.example.demo.model.entity.Docente;
import com.example.demo.repositories.repository.DocenteRepository;
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

class DocenteServiceImplTest {

    @Mock
    private DocenteRepository docenteRepository;

    @InjectMocks
    private DocenteServiceImpl docenteService;

    private Docente docente;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        docente = new Docente();
        docente.setIdDocente(1);
    }

    @Test
    void findAll() {
        List<Docente> docentes = Arrays.asList(docente);
        when(docenteRepository.findAll()).thenReturn(docentes);

        List<Docente> result = docenteService.findAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(docenteRepository, times(1)).findAll();
    }

    @Test
    void findById() {
        when(docenteRepository.findById(1)).thenReturn(Optional.of(docente));

        Optional<Docente> result = docenteService.findById(1);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getIdDocente());
        verify(docenteRepository, times(1)).findById(1);
    }

    @Test
    void save() {
        when(docenteRepository.save(any(Docente.class))).thenReturn(docente);

        Docente result = docenteService.save(docente);

        assertNotNull(result);
        assertEquals(1, result.getIdDocente());
        verify(docenteRepository, times(1)).save(docente);
    }

    @Test
    void deleteById() {
        doNothing().when(docenteRepository).deleteById(1);

        docenteService.deleteById(1);

        verify(docenteRepository, times(1)).deleteById(1);
    }
}
