package com.example.demo.model.entity;

import java.time.LocalDateTime;

import com.example.demo.model.entity.dto.DocenteDTO;
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
@Table(name = "DOCENTE_NIVELDETALLE_CURSO")
public class DocenteNivelDetalleCurso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idDocenteNivelDetalleCurso;

    @ManyToOne
    @JoinColumn(name = "IdNivelDetalleCurso")
    private NivelDetalleCurso nivelDetalleCurso;

    @ManyToOne
    @JoinColumn(name = "IdDocente")
    private Docente docente;

    private boolean activo = true;

    @Column(name = "FechaRegistro")
    private LocalDateTime fechaRegistro;


}
