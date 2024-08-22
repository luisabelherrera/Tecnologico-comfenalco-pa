
export interface AsignacionAula {
    id?: number;
    curso: { id: number }; 
    aula: { id: number }; 
    diaSemana: string;
    horaInicio: string; 
    horaFin: string;
  }
  