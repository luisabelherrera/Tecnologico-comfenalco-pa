import { Estudiante } from "./Estudiante.interface";

export interface EncuestaEstudiante {
  id?: number;
  estudiante?: Estudiante;
  problemasPersonales?: 'Ninguno' | 'Leves' | 'Graves';
  confianza?: 'Alta' | 'Media' | 'Baja';
  estadoEmocional?: 'Bueno' | 'Regular' | 'Malo';
  apoyoFamiliar?: 'Bajo' | 'Medio' | 'Alto';
  nivelEstres?: 'Alto' | 'Medio' | 'Bajo';
  estrato?: string;
  recibeSubsidio?: boolean;
  tieneAccesoInternet?: boolean;
  tieneComputador?: boolean;
  recibeAyudaPsicologica?: boolean;
  viveConPadres?: boolean;
  tieneTrabajo?: boolean;
  ingresosFamiliares?: number;
  poseeReciboLuz?: boolean;
  poseeReciboAgua?: boolean;
  poseeReciboGas?: boolean;
  tieneSisben?: boolean;
  tieneSeguroMedico?: boolean;
  horasEstudioSemanal?: number; // Changed to number
  asistencia?: number; // Changed to number
  participacionClases?: 'Baja' | 'Media' | 'Alta';
  usoPlataformaVirtual?: 'Bajo' | 'Medio' | 'Alto';
  antecedentesPerdida?: 'Sí' | 'No';
  cargaAcademica?: number; // Changed to number
}