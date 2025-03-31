package com.example.demo.model.entity;

import jakarta.persistence.*;

@Entity
public class DatosEstudiante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private long documento;
    private int edad;
    private String genero;
    private int horasEstudioSemanal;
    private double asistencia;
    private double promedioParciales;
    private String participacionClases;
    private String usoPlataformaVirtual;
    private String antecedentesPerdida;
    private String apoyoFamiliar;        // Nuevo
    private int cargaAcademica;          // Nuevo
    private String problemasPersonales;  // Nuevo
    private String perderaAsignatura;
    private String confianza;

    @ManyToOne
    @JoinColumn(name = "estudiante_id")
    private Estudiante estudiante;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public long getDocumento() { return documento; }
    public void setDocumento(long documento) { this.documento = documento; }
    public int getEdad() { return edad; }
    public void setEdad(int edad) { this.edad = edad; }
    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }
    public int getHorasEstudioSemanal() { return horasEstudioSemanal; }
    public void setHorasEstudioSemanal(int horasEstudioSemanal) { this.horasEstudioSemanal = horasEstudioSemanal; }
    public double getAsistencia() { return asistencia; }
    public void setAsistencia(double asistencia) { this.asistencia = asistencia; }
    public double getPromedioParciales() { return promedioParciales; }
    public void setPromedioParciales(double promedioParciales) { this.promedioParciales = promedioParciales; }
    public String getParticipacionClases() { return participacionClases; }
    public void setParticipacionClases(String participacionClases) { this.participacionClases = participacionClases; }
    public String getUsoPlataformaVirtual() { return usoPlataformaVirtual; }
    public void setUsoPlataformaVirtual(String usoPlataformaVirtual) { this.usoPlataformaVirtual = usoPlataformaVirtual; }
    public String getAntecedentesPerdida() { return antecedentesPerdida; }
    public void setAntecedentesPerdida(String antecedentesPerdida) { this.antecedentesPerdida = antecedentesPerdida; }
    public String getApoyoFamiliar() { return apoyoFamiliar; }
    public void setApoyoFamiliar(String apoyoFamiliar) { this.apoyoFamiliar = apoyoFamiliar; }
    public int getCargaAcademica() { return cargaAcademica; }
    public void setCargaAcademica(int cargaAcademica) { this.cargaAcademica = cargaAcademica; }
    public String getProblemasPersonales() { return problemasPersonales; }
    public void setProblemasPersonales(String problemasPersonales) { this.problemasPersonales = problemasPersonales; }
    public String getPerderaAsignatura() { return perderaAsignatura; }
    public void setPerderaAsignatura(String perderaAsignatura) { this.perderaAsignatura = perderaAsignatura; }
    public String getConfianza() { return confianza; }
    public void setConfianza(String confianza) { this.confianza = confianza; }
    public Estudiante getEstudiante() { return estudiante; }
    public void setEstudiante(Estudiante estudiante) { this.estudiante = estudiante; }

    @Override
    public String toString() {
        return "DatosEstudiante{" +
                "id=" + id +
                ", documento=" + documento +
                ", edad=" + edad +
                ", genero='" + genero + '\'' +
                ", horasEstudioSemanal=" + horasEstudioSemanal +
                ", asistencia=" + asistencia +
                ", promedioParciales=" + promedioParciales +
                ", participacionClases='" + participacionClases + '\'' +
                ", usoPlataformaVirtual='" + usoPlataformaVirtual + '\'' +
                ", antecedentesPerdida='" + antecedentesPerdida + '\'' +
                ", apoyoFamiliar='" + apoyoFamiliar + '\'' +
                ", cargaAcademica=" + cargaAcademica +
                ", problemasPersonales='" + problemasPersonales + '\'' +
                ", perderaAsignatura='" + perderaAsignatura + '\'' +
                ", confianza='" + confianza + '\'' +
                '}';
    }
}