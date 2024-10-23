import { Acudiente } from "./Acudiente.interface";
import { Estudiante } from "./Estudiante.interface";
import { NivelDetalle } from "./NivelDetalle.interface";

export interface Inscripcion {
  idInscripcion?: number;
  valorCodigo: number;
  codigo: string;
  situacion: string;
  nivelDetalle: NivelDetalle;
  estudiante: Estudiante;
  acudiente: Acudiente;
  institucionProcedencia: string;
  esRepitente: boolean;
  activo: boolean;
  fechaRegistro: Date; 
}
