package com.example.demo.model.entity;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.example.demo.model.login.UserEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Table(name = "ESTUDIANTE")

public class Estudiante implements Serializable {



    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idEstudiante;
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

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private UserEntity user;
    
@OneToMany(mappedBy = "estudiante", fetch = FetchType.LAZY)
    private List<Calificacion> calificaciones;

    
}
