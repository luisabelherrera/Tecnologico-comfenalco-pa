// src/app/models/horario.model.ts

import { NivelDetalleCurso } from "./NivelDetalleCurso.interface";

export interface Horario {
    idHorario: number;
    diaSemana: string;
    horaInicio: string; // Puedes usar string o LocalTime según tu manejo de tiempo
    horaFin: string;    // Lo mismo que arriba
    activo: boolean;
    fechaRegistro: Date;// Esto puede ser opcional dependiendo de tu uso
    nivelDetalleCurso: NivelDetalleCurso;
  }
  