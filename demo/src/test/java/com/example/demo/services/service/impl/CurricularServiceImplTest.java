package com.example.demo.services.service.impl;

import com.example.demo.model.entity.Curricular;
import com.example.demo.repositories.repository.CurricularRepository;
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

class CurricularServiceImplTest {

    @Mock
    private CurricularRepository curricularRepository;

    @InjectMocks
    private CurricularServiceImpl curricularService;

    private Curricular curricular;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        curricular = new Curricular();
        curricular.setIdCurricular(1);
    }

    @Test
    void findAll() {
        List<Curricular> curriculares = Arrays.asList(curricular);
        when(curricularRepository.findAll()).thenReturn(curriculares);

        List<Curricular> result = curricularService.findAll();

        assertNotNull(result);
        assertEquals(1, result.size());
        verify(curricularRepository, times(1)).findAll();
    }

    @Test
    void findById() {
        when(curricularRepository.findById(1)).thenReturn(Optional.of(curricular));

        Optional<Curricular> result = curricularService.findById(1);

        assertTrue(result.isPresent());
        assertEquals(1, result.get().getIdCurricular());
        verify(curricularRepository, times(1)).findById(1);
    }

    @Test
    void save() {
        when(curricularRepository.save(any(Curricular.class))).thenReturn(curricular);

        Curricular result = curricularService.save(curricular);

        assertNotNull(result);
        assertEquals(1, result.getIdCurricular());
        verify(curricularRepository, times(1)).save(curricular);
    }

    @Test
    void deleteById() {
        doNothing().when(curricularRepository).deleteById(1);

        curricularService.deleteById(1);

        verify(curricularRepository, times(1)).deleteById(1);
    }
}
