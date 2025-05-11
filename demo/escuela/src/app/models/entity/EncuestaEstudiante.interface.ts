import { Estudiante } from "./Estudiante.interface";

export interface EncuestaEstudiante {
  id?: number;
  estudiante?: Estudiante;
  problemasPersonales?: string;
  confianza?: string;
  estadoEmocional?: string;
  apoyoFamiliar?: string;
  nivelEstres?: string;
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

  // Nuevos campos agregados
  horasEstudioSemanal?: string;
  asistencia?: string;
  participacionClases?: string;
  usoPlataformaVirtual?: string;
  antecedentesPerdida?: string;
  cargaAcademica?: string;
}
