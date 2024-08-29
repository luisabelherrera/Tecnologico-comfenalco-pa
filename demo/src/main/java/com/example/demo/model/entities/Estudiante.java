package com.example.demo.model.entities;


import jakarta.persistence.*;
import lombok.Data;


import java.time.LocalDate;


@Data
@Entity
@Table(name = "estudiantes")
public class Estudiante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String apellido;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    private String grado;
    private String direccion;
    private String telefono;
    private String email;
    private String documento; 
    private String genero;  
    private String estado; 

    @ManyToOne
    @JoinColumn(name = "tutor_id")
    private Tutor tutor;


}