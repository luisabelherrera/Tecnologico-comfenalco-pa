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
@Table(name = "DOCENTE_NIVELDETALLE_CURSO")
public class DocenteNivelDetalleCurso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idDocenteNivelDetalleCurso;

    @ManyToOne
    @JoinColumn(name = "IdNivelDetalleCurso")
    private NivelDetalleCurso nivelDetalleCurso;

    @ManyToOne
    @JoinColumn(name = "IdDocente")
    private Docente docente;

    private boolean activo = true;

    @Column(name = "FechaRegistro")
    private LocalDateTime fechaRegistro;

    // Constructor
    public DocenteNivelDetalleCurso() {
        this.fechaRegistro = LocalDateTime.now();
    }
}
