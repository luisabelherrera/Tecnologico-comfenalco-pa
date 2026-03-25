
import { Periodo } from './Periodo.interface';

export interface Nivel {
    idNivel: number; 
    periodo: Periodo; 
    descripcionNivel: string;
    descripcionTurno: string;
    horaInicio: string; 
    horaFin: string; 
    activo: boolean;
}
