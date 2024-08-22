package com.example.demo.services.impl;

import com.example.demo.model.entities.Tutor;
import com.example.demo.repositories.TutorRepository;
import com.example.demo.services.TutorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TutorServiceImpl implements TutorService {

    private final TutorRepository tutorRepository;

    @Autowired
    public TutorServiceImpl(TutorRepository tutorRepository) {
        this.tutorRepository = tutorRepository;
    }

    @Override
    public Tutor saveTutor(Tutor tutor) {
        return tutorRepository.save(tutor);
    }

    @Override
    public Optional<Tutor> getTutorById(Long id) {
        return tutorRepository.findById(id);
    }

    @Override
    public List<Tutor> getAllTutores() {
        return tutorRepository.findAll();
    }




    @Override
    public Tutor updateTutor(Tutor tutor) {
        return tutorRepository.save(tutor);
    }

    @Override
    public void deleteTutor(Long id) {
        tutorRepository.deleteById(id);
    }
}