// src/app/models/entity/nivel-detalle-curso.interface.ts

import { Curso } from "./curso.model";
import { NivelDetalle } from "./NivelDetalle.interface";


export interface NivelDetalleCurso {
    idNivelDetalleCurso: number;
    nivelDetalle: NivelDetalle;
    curso: Curso;
    activo: boolean;
    fechaRegistro: Date; // Correctly set to Date type
}
