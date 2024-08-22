package com.example.demo.model.entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "calificaciones")
@SequenceGenerator(name = "calificacionSeq", sequenceName = "calificacion_seq", allocationSize = 1)
public class Calificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "calificacionSeq")
    private Long id;

    private double valorCalificacion;
    private String comentario;


    @ManyToOne
    @JoinColumn(name = "periodo_id")
    private Periodo periodo;


    @ManyToOne
    @JoinColumn(name = "asignatura_cursada_id")
    private AsignaturaCursada asignaturaCursada;


}