export interface AsignacionAula {
  id?: number;
  curso: { 
    id: number; 
    nombre?: string; 
  };
  aula: { 
    id: number; 
    nombre?: string; 
  };
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
}
