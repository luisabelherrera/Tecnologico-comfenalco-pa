package com.example.demo.model.entity.dto;

import jakarta.validation.constraints.NotNull;

public class DocenteDto {

    @NotNull(message = "Código cannot be null")
    private String codigo;

    @NotNull(message = "Documento de Identidad cannot be null")
    private String documentoIdentidad;

    @NotNull(message = "Nombres cannot be null")
    private String nombres;

    @NotNull(message = "Apellidos cannot be null")
    private String apellidos;

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getDocumentoIdentidad() {
        return documentoIdentidad;
    }

    public void setDocumentoIdentidad(String documentoIdentidad) {
        this.documentoIdentidad = documentoIdentidad;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }
}
