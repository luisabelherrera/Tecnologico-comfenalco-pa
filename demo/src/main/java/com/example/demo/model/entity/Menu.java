package com.example.demo.model.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "MENU")
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idMenu;

    private String nombre;
    private String icono;
    private boolean activo = true;

    @Column(name = "FechaRegistro")
    private LocalDateTime fechaRegistro = LocalDateTime.now();

    // Getters y Setters
}
