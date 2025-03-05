package com.example.demo.model.entity.dto;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.demo.model.login.dto.UserDto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EstudianteDTO implements Serializable {
    private Integer idEstudiante;

    private int valorCodigo;
    private String codigo;
    private String nombres;
    private String apellidos;
    private String documentoIdentidad;
    private LocalDate fechaNacimiento;
    private String sexo;
    private String ciudad;
    private String direccion;
    private boolean activo;
    private LocalDateTime fechaRegistro;
    private Long userId;
}