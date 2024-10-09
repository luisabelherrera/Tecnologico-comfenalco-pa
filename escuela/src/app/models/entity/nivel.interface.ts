// src/app/models/entity/nivel.interface.ts

import { Periodo } from './Periodo.interface';

export interface Nivel {
    idNivel: number; 
    periodo: Periodo; // Asegúrate de que sea del tipo Periodo
    descripcionNivel: string;
    descripcionTurno: string;
    horaInicio: string; // Debe ser un string, representa una hora
    horaFin: string;    // Debe ser un string, representa una hora
    activo: boolean;
}
