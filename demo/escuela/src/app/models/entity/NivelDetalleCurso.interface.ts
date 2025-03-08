// src/app/models/entity/NivelDetalleCurso.interface.ts
import { Curso } from "./curso.model";
import { NivelDetalle } from "./NivelDetalle.interface";

export interface NivelDetalleCurso {
  idNivelDetalleCurso: number;
  nivelDetalle?: NivelDetalle; // Opcional
  curso?: Curso; // Opcional
  activo?: boolean; // Opcional
  fechaRegistro?: Date; // Opcional
}