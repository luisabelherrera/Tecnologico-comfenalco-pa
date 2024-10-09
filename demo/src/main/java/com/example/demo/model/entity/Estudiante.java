package com.example.demo.model.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "ESTUDIANTE")
public class Estudiante {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idEstudiante;

    private int valorCodigo;
    private String codigo;
    private String nombres;
    private String apellidos;
    private String documentoIdentidad;

    @Column(name = "FechaNacimiento")
    private LocalDate fechaNacimiento;

    private String sexo;
    private String ciudad;
    private String direccion;
    private boolean activo = true;

    @Column(name = "FechaRegistro")
    private LocalDateTime fechaRegistro = LocalDateTime.now();

    // Getters y Setters
}
