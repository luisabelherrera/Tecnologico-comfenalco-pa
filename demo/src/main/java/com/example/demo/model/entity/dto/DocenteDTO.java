package com.example.demo.model.entity.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DocenteDTO {
    private long idDocente;
    private int valorCodigo;
    private String codigo;
    private String documentoIdentidad;
    private String nombres;
    private String apellidos;
    private LocalDate fechaNacimiento;
    private String sexo;
    private String gradoEstudio;
    private String ciudad;
    private String direccion;
    private String email;
    private String numeroTelefono;
    private boolean activo;
    private LocalDateTime fechaRegistro;
}