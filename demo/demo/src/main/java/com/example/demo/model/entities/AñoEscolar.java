package com.example.demo.model.entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "años_escolares")
public class AñoEscolar {


    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "añoEscolarSeq")
    private Long id;

    private String nombre;

    private LocalDate fechaInicio;

    private LocalDate fechaFin;

    @OneToMany(mappedBy = "anioEscolar")
    private List<Curso> cursos;

    @OneToMany(mappedBy = "anioEscolar")
    private List<Periodo> periodos;


}