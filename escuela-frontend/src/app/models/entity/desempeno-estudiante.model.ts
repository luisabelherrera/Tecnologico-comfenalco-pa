import { Estudiante } from "./Estudiante.interface";
import { Inscripcion } from "./Inscripcion.interface";

export interface DesempenoEstudiante {
  idDesempeno?: number;
  estudiante: Estudiante; // Contiene fechaNacimiento y sexo
  horasEstudioSemanal: number;
  asistencia: number;
  promedioParciales: number;
  participacionClases: 'Baja' | 'Media' | 'Alta';
  usoPlataformaVirtual: 'Bajo' | 'Medio' | 'Alto';
  antecedentesPerdida: 'Sí' | 'No';
  perderaAsignatura: 'Sí' | 'No';
  fechaRegistro?: string;
  inscripcion?: Inscripcion;
}