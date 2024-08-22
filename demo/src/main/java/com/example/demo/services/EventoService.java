package com.example.demo.services;


import com.example.demo.model.entities.Evento;

import java.util.List;
import java.util.Optional;

public interface EventoService {
    Evento saveEvento(Evento evento);
    Optional<Evento> getEventoById(Long id);
    List<Evento> getAllEventos();
    Evento updateEvento(Evento evento);
    void deleteEvento(Long id);
}