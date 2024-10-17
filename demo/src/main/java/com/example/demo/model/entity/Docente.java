package com.example.demo.model.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
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

    @Column(name = "FechaRegistro")
    private LocalDateTime fechaRegistro = LocalDateTime.now();


}
