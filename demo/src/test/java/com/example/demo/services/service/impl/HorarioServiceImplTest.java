package com.example.demo.services.service.impl;

import com.example.demo.model.entity.Horario;
import com.example.demo.repositories.repository.HorarioRepository;
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

class HorarioServiceImplTest {

    @Mock
    private HorarioRepository horarioRepository;

    @InjectMocks
    private HorarioServiceImpl horarioService;

    private Horario horario;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        horario = new Horario();
        horario.setIdHorario(1);
    }

    @Test
    void findAll() {
        List<Horario> horarios = Arrays.asList(horario);
        when(horarioRepository.findAll()).thenReturn(horarios);

        List<Horario> result = horarioService.findAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(horarioRepository, times(1)).findAll();
    }

    @Test
    void findById() {
        when(horarioRepository.findById(1)).thenReturn(Optional.of(horario));

        Optional<Horario> result = horarioService.findById(1);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getIdHorario());
        verify(horarioRepository, times(1)).findById(1);
    }

    @Test
    void save() {
        when(horarioRepository.save(any(Horario.class))).thenReturn(horario);

        Horario result = horarioService.save(horario);

        assertNotNull(result);
        assertEquals(1, result.getIdHorario());
        verify(horarioRepository, times(1)).save(horario);
    }

    @Test
    void deleteById() {
        doNothing().when(horarioRepository).deleteById(1);

        horarioService.deleteById(1);

        verify(horarioRepository, times(1)).deleteById(1);
    }
}
