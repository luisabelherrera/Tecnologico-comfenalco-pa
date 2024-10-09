package com.example.demo.model.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "CURRICULAR")
public class Curricular {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idCurricular;

    @ManyToOne
    @JoinColumn(name = "IdDocenteNivelDetalleCurso")
    private DocenteNivelDetalleCurso docenteNivelDetalleCurso;

    private String descripcion;
    private boolean activo = true;

    @Column(name = "FechaRegistro")
    private LocalDateTime fechaRegistro = LocalDateTime.now();

    // Getters y Setters
}
