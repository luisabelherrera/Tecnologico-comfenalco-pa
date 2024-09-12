package com.example.demo.model.entities;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalTime;


@Data
@Entity
@Table(name = "asignaciones_aulas")
public class AsignacionAula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "curso_id")
    private Curso curso;

    @ManyToOne
    @JoinColumn(name = "aula_id")
    private Aula aula;

    @Column(name = "dia_semana")
    private String diaSemana;

    @Column(name = "hora_inicio")
    private LocalTime horaInicio;

    @Column(name = "hora_fin")
    private LocalTime horaFin;


}
