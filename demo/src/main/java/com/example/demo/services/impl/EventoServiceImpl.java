package com.example.demo.services.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.demo.model.entities.Evento;
import com.example.demo.repositories.EventoRepository;
import com.example.demo.services.EventoService;

@Service
public class EventoServiceImpl implements EventoService {

    private final EventoRepository eventoRepository;

    public EventoServiceImpl(EventoRepository eventoRepository) {
        this.eventoRepository = eventoRepository;
    }

    @Override
    public Evento saveEvento(Evento evento) {
        return eventoRepository.save(evento);
    }

    @Override
    public Optional<Evento> getEventoById(Long id) {
        return eventoRepository.findById(id);
    }

    @Override
    public List<Evento> getAllEventos() {
        return eventoRepository.findAll();
    }

    @Override
    public Evento updateEvento(Evento evento) {
        return eventoRepository.save(evento);
    }

    @Override
    public void deleteEvento(Long id) {
        eventoRepository.deleteById(id);
    }
}
