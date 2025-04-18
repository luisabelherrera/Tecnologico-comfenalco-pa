// InformacionInstitucional.java
package com.example.demo.model.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "informacion_institucional")
public class InformacionInstitucional {
    @Id
    private String id;
    private String nombreInstitucion;
    private String mision;
    private String vision;
    private String historia;
    private String valores;
    private String objetivos;
    private String contacto;
    private String manualConvivenciaPath;
    private String reglamentoInternoPath;
    private String logoPath;
    private String nivelesEducativos;
    private String enfasisInstitucional;
    private String preparacionIcfes;
    private String programasEspeciales;
    private String convenios;
    private String actividadesExtracurriculares;
    private String pastoralOCatequesis;
    private String planDeEstudiosPath;
    private String calendarioAcademicoPath;
}