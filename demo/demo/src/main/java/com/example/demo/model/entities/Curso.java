package com.example.demo.model.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "cursos")
public class Curso {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cursosSeq")
    private Long id;

    private String nombre;


    @ManyToOne
    @JoinColumn(name = "anioEscolar_id")
    private AñoEscolar anioEscolar;


    @OneToMany(mappedBy = "curso")
    private List<Matricula> matriculas;



}