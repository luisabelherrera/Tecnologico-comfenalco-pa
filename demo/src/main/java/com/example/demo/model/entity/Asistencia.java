package com.example.demo.model.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "asistencia")
@Data // Lombok para getters, setters, etc.
public class Asistencia implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_asistencia")
    private Integer idAsistencia;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "asistio", nullable = false)
    private Boolean asistio;

    @ManyToOne
    @JoinColumn(name = "id_estudiante", nullable = false)
    private Estudiante estudiante;

    @ManyToOne
    @JoinColumn(name = "id_nivel_detalle_curso", nullable = false)
    private NivelDetalleCurso nivelDetalleCurso;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    // Constructor vacío requerido por JPA
    public Asistencia() {}

    // Constructor con campos principales
    public Asistencia(LocalDate fecha, Boolean asistio, Estudiante estudiante, NivelDetalleCurso nivelDetalleCurso) {
        this.fecha = fecha;
        this.asistio = asistio;
        this.estudiante = estudiante;
        this.nivelDetalleCurso = nivelDetalleCurso;
        this.fechaRegistro = LocalDateTime.now();
    }
}