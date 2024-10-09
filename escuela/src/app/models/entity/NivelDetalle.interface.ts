// src/app/models/entity/NivelDetalle.interface.ts
import { GradoSeccion } from "./GradoSeccion.interface";
import { Nivel } from "./nivel.interface";

export interface NivelDetalle {
    idNivelDetalle: number;
    nivel: Nivel; // Objeto Nivel
    gradoSeccion: GradoSeccion; // Objeto GradoSeccion
    totalVacantes: number;
    vacantesDisponibles: number;
    vacantesOcupadas: number;
    activo: boolean;
    // descripcionNivel: string; // Esta línea ha sido eliminada
}
