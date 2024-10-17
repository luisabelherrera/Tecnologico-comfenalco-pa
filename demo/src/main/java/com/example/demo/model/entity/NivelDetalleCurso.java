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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "NIVEL_DETALLE_CURSO")
public class NivelDetalleCurso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idNivelDetalleCurso;

    @ManyToOne
    @JoinColumn(name = "IdNivelDetalle")
    private NivelDetalle nivelDetalle;

    @ManyToOne
    @JoinColumn(name = "IdCurso")
    private Curso curso;

    private boolean activo = true;
    @Column(name = "FechaRegistro")
    private LocalDate fechaRegistro = LocalDate.now();

}
