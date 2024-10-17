package com.example.demo.model.entity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AcudienteDTO {
    private long idAcudiente;
    private String parentesco;
    private String nombres;
    private String apellidos;
    private String documentoIdentidad;
    private LocalDate fechaNacimiento;
    private String sexo;
    private String estadoCivil;
    private String ciudad;
    private String direccion;
    private boolean activo;
    private LocalDateTime fechaRegistro;
}