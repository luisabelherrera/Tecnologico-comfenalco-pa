// PrecioNivelEducativo.java
package com.example.demo.model.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "precios_nivel_educativo")
public class PrecioNivelEducativo {

    @Id
    private String id;
    private String nivel;           // e.g., "Primaria", "Secundaria"
    private String concepto;        // e.g., "Matrícula", "Mensualidad"
    private double monto;           // Price amount
    private String imagenPath;      // Image path
    private String descripcion;     // Brief description of the price
    private String periodicidad;    // "Mensual", "Anual", "Única vez"
    private Date fechaInicio;       // Start date of validity
    private Date fechaFin;          // End date of validity (optional)
    private Double descuento;       // Discount percentage (e.g., 10.0 for 10%)
    private String categoria;       // Category (e.g., "Cursos", "Talleres")

    // Constructors
    public PrecioNivelEducativo() {}

    public PrecioNivelEducativo(String nivel, String concepto, double monto, String imagenPath,
                                String descripcion, String periodicidad, Date fechaInicio,
                                Date fechaFin, Double descuento, String categoria) {
        this.nivel = nivel;
        this.concepto = concepto;
        this.monto = monto;
        this.imagenPath = imagenPath;
        this.descripcion = descripcion;
        this.periodicidad = periodicidad;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.descuento = descuento;
        this.categoria = categoria;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNivel() { return nivel; }
    public void setNivel(String nivel) { this.nivel = nivel; }

    public String getConcepto() { return concepto; }
    public void setConcepto(String concepto) { this.concepto = concepto; }

    public double getMonto() { return monto; }
    public void setMonto(double monto) { this.monto = monto; }

    public String getImagenPath() { return imagenPath; }
    public void setImagenPath(String imagenPath) { this.imagenPath = imagenPath; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getPeriodicidad() { return periodicidad; }
    public void setPeriodicidad(String periodicidad) { this.periodicidad = periodicidad; }

    public Date getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(Date fechaInicio) { this.fechaInicio = fechaInicio; }

    public Date getFechaFin() { return fechaFin; }
    public void setFechaFin(Date fechaFin) { this.fechaFin = fechaFin; }

    public Double getDescuento() { return descuento; }
    public void setDescuento(Double descuento) { this.descuento = descuento; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
}