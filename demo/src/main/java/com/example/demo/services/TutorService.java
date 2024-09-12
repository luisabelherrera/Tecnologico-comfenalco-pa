package com.example.demo.services;

import com.example.demo.model.entities.Tutor;


import java.util.List;
import java.util.Optional;


public interface TutorService {
    Tutor saveTutor(Tutor tutor);
    Optional<Tutor> getTutorById(Long id);
    List<Tutor> getAllTutores();
    Tutor updateTutor(Tutor tutor);
    void deleteTutor(Long id);
}