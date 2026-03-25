
import { NivelDetalleCurso } from "./NivelDetalleCurso.interface";

export interface Horario {
    idHorario: number;
    diaSemana: string;
    horaInicio: string; 
    horaFin: string;    
    activo: boolean;
    fechaRegistro: Date;
    nivelDetalleCurso: NivelDetalleCurso;
  }
  