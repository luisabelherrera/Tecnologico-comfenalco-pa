package com.example.demo.model.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;

@Entity
@Table(name = "encuesta_estudiante")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EncuestaEstudiante implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "estudiante_id", unique = true)
    @JsonBackReference
    private Estudiante estudiante;

    // Información emocional/personal
    private String problemasPersonales;
    private String confianza;
    private String estadoEmocional;
    private String apoyoFamiliar;
    private String nivelEstres;

    // Información socioeconómica
    private String estrato;
    private Boolean recibeSubsidio;
    private Boolean tieneAccesoInternet;
    private Boolean tieneComputador;
    private Boolean recibeAyudaPsicologica;
    private Boolean viveConPadres;
    private Boolean tieneTrabajo;
    private Double ingresosFamiliares;

    // Comprobantes y documentación
    private Boolean poseeReciboLuz;
    private Boolean poseeReciboAgua;
    private Boolean poseeReciboGas;
    private Boolean tieneSisben;
    private Boolean tieneSeguroMedico;



    // Nuevos campos agregados
    private String horasEstudioSemanal;
    private String asistencia;
    private String participacionClases;
    private String usoPlataformaVirtual;
    private String antecedentesPerdida;
    private String cargaAcademica;
}