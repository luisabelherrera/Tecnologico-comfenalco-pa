package com.example.demo.model.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "desempeno_estudiante")
public class DesempenoEstudiante implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_desempeno")
    private Integer idDesempeno;

    @ManyToOne
    @JoinColumn(name = "id_estudiante", nullable = false)
    private Estudiante estudiante;

    @Column(name = "edad", nullable = false)
    private Integer edad;

    @Enumerated(EnumType.STRING)
    @Column(name = "genero", nullable = false)
    private Genero genero;

    @Column(name = "horas_estudio_semanal", nullable = false)
    private Integer horasEstudioSemanal;

    @Column(name = "asistencia", nullable = false) // Eliminado precision y scale
    private Double asistencia;

    @Column(name = "promedio_parciales", nullable = false) // Eliminado precision y scale
    private Double promedioParciales;

    @Enumerated(EnumType.STRING)
    @Column(name = "participacion_clases", nullable = false)
    private ParticipacionClases participacionClases;

    @Enumerated(EnumType.STRING)
    @Column(name = "uso_plataforma_virtual", nullable = false)
    private UsoPlataformaVirtual usoPlataformaVirtual;

    @Enumerated(EnumType.STRING)
    @Column(name = "antecedentes_perdida", nullable = false)
    private SiNo antecedentesPerdida;

    @Enumerated(EnumType.STRING)
    @Column(name = "perdera_asignatura", nullable = false)
    private SiNo perderaAsignatura;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDateTime fechaRegistro = LocalDateTime.now();

    // Enumeraciones
    public enum Genero {
        Masculino, Femenino, Otro
    }

    public enum ParticipacionClases {
        Baja, Media, Alta
    }

    public enum UsoPlataformaVirtual {
        Bajo, Medio, Alto
    }

    public enum SiNo {
        Sí, No
    }

    // Constructores
    public DesempenoEstudiante() {
    }

    public DesempenoEstudiante(Estudiante estudiante, Integer edad, Genero genero, Integer horasEstudioSemanal,
                               Double asistencia, Double promedioParciales, ParticipacionClases participacionClases,
                               UsoPlataformaVirtual usoPlataformaVirtual, SiNo antecedentesPerdida, SiNo perderaAsignatura) {
        this.estudiante = estudiante;
        this.edad = edad;
        this.genero = genero;
        this.horasEstudioSemanal = horasEstudioSemanal;
        this.asistencia = asistencia;
        this.promedioParciales = promedioParciales;
        this.participacionClases = participacionClases;
        this.usoPlataformaVirtual = usoPlataformaVirtual;
        this.antecedentesPerdida = antecedentesPerdida;
        this.perderaAsignatura = perderaAsignatura;
    }

    // Getters y Setters (sin cambios)
    public Integer getIdDesempeno() { return idDesempeno; }
    public void setIdDesempeno(Integer idDesempeno) { this.idDesempeno = idDesempeno; }
    public Estudiante getEstudiante() { return estudiante; }
    public void setEstudiante(Estudiante estudiante) { this.estudiante = estudiante; }
    public Integer getEdad() { return edad; }
    public void setEdad(Integer edad) { this.edad = edad; }
    public Genero getGenero() { return genero; }
    public void setGenero(Genero genero) { this.genero = genero; }
    public Integer getHorasEstudioSemanal() { return horasEstudioSemanal; }
    public void setHorasEstudioSemanal(Integer horasEstudioSemanal) { this.horasEstudioSemanal = horasEstudioSemanal; }
    public Double getAsistencia() { return asistencia; }
    public void setAsistencia(Double asistencia) { this.asistencia = asistencia; }
    public Double getPromedioParciales() { return promedioParciales; }
    public void setPromedioParciales(Double promedioParciales) { this.promedioParciales = promedioParciales; }
    public ParticipacionClases getParticipacionClases() { return participacionClases; }
    public void setParticipacionClases(ParticipacionClases participacionClases) { this.participacionClases = participacionClases; }
    public UsoPlataformaVirtual getUsoPlataformaVirtual() { return usoPlataformaVirtual; }
    public void setUsoPlataformaVirtual(UsoPlataformaVirtual usoPlataformaVirtual) { this.usoPlataformaVirtual = usoPlataformaVirtual; }
    public SiNo getAntecedentesPerdida() { return antecedentesPerdida; }
    public void setAntecedentesPerdida(SiNo antecedentesPerdida) { this.antecedentesPerdida = antecedentesPerdida; }
    public SiNo getPerderaAsignatura() { return perderaAsignatura; }
    public void setPerderaAsignatura(SiNo perderaAsignatura) { this.perderaAsignatura = perderaAsignatura; }
    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }
}