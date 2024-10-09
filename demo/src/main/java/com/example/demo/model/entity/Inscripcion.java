package com.example.demo.model.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "INSCRIPCION") // Cambia el nombre de la tabla si es necesario
public class Inscripcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idInscripcion; // Cambia el nombre del ID si es necesario

    private int valorCodigo;
    private String codigo;
    private String situacion;

    @ManyToOne
    @JoinColumn(name = "id_estudiante", nullable = false)
    private Estudiante estudiante;

    @ManyToOne
    @JoinColumn(name = "id_acudiente", nullable = false)
    private Acudiente acudiente;

    @ManyToOne
    @JoinColumn(name = "id_nivel_detalle", nullable = false)
    private NivelDetalle nivelDetalle;

    private String institucionProcedencia;
    private boolean esRepitente;
    private boolean activo = true;

    @Column(name = "FechaRegistro")
    private LocalDate fechaRegistro;

    public int getIdInscripcion() {
        return idInscripcion;
    }

    public void setIdInscripcion(int idInscripcion) {
        this.idInscripcion = idInscripcion;
    }

    public int getValorCodigo() {
        return valorCodigo;
    }

    public void setValorCodigo(int valorCodigo) {
        this.valorCodigo = valorCodigo;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getSituacion() {
        return situacion;
    }

    public void setSituacion(String situacion) {
        this.situacion = situacion;
    }

    public Estudiante getEstudiante() {
        return estudiante;
    }

    public void setEstudiante(Estudiante estudiante) {
        this.estudiante = estudiante;
    }

    public Acudiente getAcudiente() {
        return acudiente;
    }

    public void setAcudiente(Acudiente acudiente) {
        this.acudiente = acudiente;
    }

    public NivelDetalle getNivelDetalle() {
        return nivelDetalle;
    }

    public void setNivelDetalle(NivelDetalle nivelDetalle) {
        this.nivelDetalle = nivelDetalle;
    }

    public String getInstitucionProcedencia() {
        return institucionProcedencia;
    }

    public void setInstitucionProcedencia(String institucionProcedencia) {
        this.institucionProcedencia = institucionProcedencia;
    }

    public boolean isEsRepitente() {
        return esRepitente;
    }

    public void setEsRepitente(boolean esRepitente) {
        this.esRepitente = esRepitente;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public LocalDate getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDate fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    // Getters and Setters
}
