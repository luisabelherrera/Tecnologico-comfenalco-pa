package com.example.demo.model.entities;


import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Entity
@Table(name = "periodos")
public class Periodo {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "periodoSeq")

    private Long id;
    private String nombre;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;


    @ManyToOne
    @JoinColumn(name = "anio_escolar_id")
    private AñoEscolar anioEscolar;


    @OneToMany(mappedBy = "periodo")
    private List<Calificacion> calificaciones;


}