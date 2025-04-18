import { EncuestaEstudiante } from "./EncuestaEstudiante.interface";

export interface Estudiante {
  idEstudiante: number;
  valorCodigo?: string;
  codigo?: string;
  nombres?: string;
  apellidos?: string;
  documentoIdentidad?: string;
  fechaNacimiento?: Date; // Ajustado a string para JSON
  sexo?: string;
  ciudad?: string;
  direccion?: string;
  activo?: boolean;
  encuesta?: EncuestaEstudiante; 
}