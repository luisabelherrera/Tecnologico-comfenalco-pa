

package com.example.demo.model.entities;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
@Entity
@Table(name = "asignaturas_cursadas")
public class AsignaturaCursada {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "AsignaturaCursadaSeq")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "asignatura_id")
    private Asignatura asignatura;



    @OneToMany(mappedBy = "asignaturaCursada")
    private List<Matricula> matriculas;

    @OneToMany(mappedBy = "asignaturaCursada")
    private List<Calificacion> calificaciones;
}