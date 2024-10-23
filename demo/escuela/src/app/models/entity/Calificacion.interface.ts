import { Curricular } from "./curricular.model";
import { Estudiante } from "./Estudiante.interface";

export interface Calificacion {
    idCalificacion: number;
    curricular: Curricular;      
    estudiante: Estudiante;      
    nota: number;
    activo: boolean;
    fechaRegistro: Date;
}
