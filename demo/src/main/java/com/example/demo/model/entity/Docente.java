package com.example.demo.model.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.demo.model.login.UserEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "DOCENTE")
public class Docente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idDocente;

    private int valorCodigo;
    private String codigo;
    private String documentoIdentidad;
    private String nombres;
    private String apellidos;

    @Column(name = "FechaNacimiento")
    private LocalDate fechaNacimiento;

    private String sexo;
    private String gradoEstudio;
    private String ciudad;
    private String direccion;
    private String email;
    private String numeroTelefono;
    private boolean activo = true;

    @OneToOne(mappedBy = "docente", cascade = CascadeType.ALL)
    private UserEntity user;

    @Column(name = "FechaRegistro")
    private LocalDateTime fechaRegistro = LocalDateTime.now();

    // Getters y Setters
}
