package com.example.demo.model.entity;

import java.io.Serializable;
import java.time.LocalDate;

import com.example.demo.model.entity.enu.EstadoPago;
import jakarta.persistence.*;


@Entity
@Table(name = "INSCRIPCION")
public class Inscripcion implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idInscripcion;

    private int valorCodigo;
    private String codigo;
    private String situacion;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_estudiante")
    private Estudiante estudiante;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "acudiente_id")
    private Acudiente acudiente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_nivel_detalle")
    private NivelDetalle nivelDetalle;

    private String institucionProcedencia;
    private boolean esRepitente;
    private boolean activo = true;

    @Column(name = "fecha_registro")
    private LocalDate fechaRegistro;

    // Datos de pago
    private double montoPago;

    @Column(name = "fecha_pago")
    private LocalDate fechaPago;

    private String metodoPago; // Ejemplo: "Efectivo", "Tarjeta", "Transferencia"

    @Enumerated(EnumType.STRING)
    private EstadoPago estadoPago = EstadoPago.PENDIENTE; // Valor por defecto: "Pendiente"

    // Getters y Setters
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

    public double getMontoPago() {
        return montoPago;
    }

    public void setMontoPago(double montoPago) {
        this.montoPago = montoPago;
    }

    public LocalDate getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(LocalDate fechaPago) {
        this.fechaPago = fechaPago;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public EstadoPago getEstadoPago() {
        return estadoPago;
    }

    public void setEstadoPago(EstadoPago estadoPago) {
        this.estadoPago = estadoPago;
    }
}
