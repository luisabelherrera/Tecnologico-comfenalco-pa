package com.example.demo.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "calificaciona")
public class CalificacionAsignada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCalificacion;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @Column(name = "nota", nullable = false)
    private Float nota;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_nivel_detalle_curso", nullable = false)
    private NivelDetalleCurso nivelDetalleCurso;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_estudiante", nullable = false)
    private Estudiante estudiante;
    // Constructores
    public CalificacionAsignada() {
    }

    public CalificacionAsignada(Boolean activo, LocalDateTime fechaRegistro, Float nota,
                               NivelDetalleCurso nivelDetalleCurso, Estudiante estudiante) {
        this.activo = activo;
        this.fechaRegistro = fechaRegistro;
        this.nota = nota;
        this.nivelDetalleCurso = nivelDetalleCurso;
        this.estudiante = estudiante;
    }

    // Getters y Setters
    public Integer getIdCalificacion() {
        return idCalificacion;
    }

    public void setIdCalificacion(Integer idCalificacion) {
        this.idCalificacion = idCalificacion;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public Float getNota() {
        return nota;
    }

    public void setNota(Float nota) {
        this.nota = nota;
    }

    public NivelDetalleCurso getNivelDetalleCurso() {
        return nivelDetalleCurso;
    }

    public void setNivelDetalleCurso(NivelDetalleCurso nivelDetalleCurso) {
        this.nivelDetalleCurso = nivelDetalleCurso;
    }

    public Estudiante getEstudiante() {
        return estudiante;
    }

    public void setEstudiante(Estudiante estudiante) {
        this.estudiante = estudiante;
    }
}