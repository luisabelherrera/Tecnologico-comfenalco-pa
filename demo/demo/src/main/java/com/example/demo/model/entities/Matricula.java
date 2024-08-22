package com.example.demo.model.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;


@Getter
@Setter
@Entity
@Table(name = "matriculas")
public class Matricula {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    private String estado;

    @NotNull
    private LocalDate fechaMatricula;


    @ManyToOne
    @JoinColumn(name = "estudiante_id")
    @NotNull
    private Estudiante estudiante;


    @ManyToOne
    @JoinColumn(name = "curso_id")
    @NotNull
    private Curso curso;

    @ManyToOne
    @JoinColumn(name = "asignatura_cursada_id")
    private AsignaturaCursada asignaturaCursada;

    @NotNull
    @PositiveOrZero
    private double costoMatricula;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TipoMatricula tipoMatricula;

    public enum TipoMatricula {
        NUEVA, TRANSFERENCIA, READMISION
    }
}