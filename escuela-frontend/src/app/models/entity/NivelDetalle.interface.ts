import { GradoSeccion } from "./GradoSeccion.interface";
import { Nivel } from "./nivel.interface";

export interface NivelDetalle {
    idNivelDetalle: number;
    nivel: Nivel; 
    gradoSeccion: GradoSeccion; 
    totalVacantes: number;
    vacantesDisponibles: number;
    vacantesOcupadas: number;
    activo: boolean;
   
}
