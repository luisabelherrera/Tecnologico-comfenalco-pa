package com.example.demo.model.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.apache.tomcat.util.codec.binary.Base64;

import java.util.List;

@Entity
@Setter
@Getter
@Table(name = "estudiantes")
public class Estudiante {


    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "estudianteSeq")
    private long id;

    @Column(nullable = false)
    private String nombreCompleto;

    @Column(nullable = false)
    private String fechaNacimiento;

    @Column(nullable = false)
    private String direccion;

    @Column(nullable = false)
    private String telefono;

    @Column(nullable = false)
    private String correoElectronico;

    @Column(nullable = false)
    private String genero;

    @Column(nullable = false)
    private String nacionalidad;

    @Lob
    @Column
    private byte[] fotoDatos;

    private String formatoFoto;

    @OneToMany(mappedBy = "estudiante")
    private List<Matricula> matriculas;

    public String generateBase64Image() {
        return Base64.encodeBase64String(this.fotoDatos);
    }
}
