package com.example.demo.model.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "profesores")
public class Profesor {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "profesoresSeq")
    private Long id;

    @NotNull
    private String nombreCompleto;
    @NotNull
    private LocalDate fechaNacimiento;
    @NotNull
    private String direccion;
    @NotNull
    private String telefono;
    @NotNull
    private String correoElectronico;
    @NotNull
    private String genero;
    @NotNull
    private String nacionalidad;


    @OneToMany(mappedBy = "profesor")
    private List<Asignatura> asignaturas;
}
