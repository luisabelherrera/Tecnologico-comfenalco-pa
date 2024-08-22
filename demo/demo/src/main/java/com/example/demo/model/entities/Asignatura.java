package com.example.demo.model.entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "asignaturas")
@SequenceGenerator(name = "asignaturaSeq", sequenceName = "asignatura_seq", allocationSize = 1)
public class Asignatura {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "asignaturaSeq")
    private Long id;


    private String nombre;

    private String codigo;


    private String descripcion;

    private int creditos;

    @OneToMany(mappedBy = "asignatura")
    private List<AsignaturaCursada> asignaturasCursadas;

    @ManyToOne
    @JoinColumn(name = "profesor_id")
    private Profesor profesor;


}
