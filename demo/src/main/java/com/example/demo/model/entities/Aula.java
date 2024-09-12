

package com.example.demo.model.entities;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "aulas")
public class Aula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private int capacidad;
    private String ubicacion;


}
