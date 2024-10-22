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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "NIVEL_DETALLE")
public class NivelDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idNivelDetalle;

    @ManyToOne
    @JoinColumn(name = "IdNivel")
    private Nivel nivel;

    @ManyToOne
    @JoinColumn(name = "IdGradoSeccion")
    private GradoSeccion gradoSeccion;

    private int totalVacantes;
    private int vacantesDisponibles;
    private int vacantesOcupadas;
    private boolean activo = true;

    @Column(name = "FechaRegistro")
    private LocalDateTime fechaRegistro = LocalDateTime.now();

    public void setTotalVacantes(int totalVacantes) {
        this.totalVacantes = totalVacantes;
        this.vacantesDisponibles = totalVacantes;
        this.vacantesOcupadas = 0;
    }

}
