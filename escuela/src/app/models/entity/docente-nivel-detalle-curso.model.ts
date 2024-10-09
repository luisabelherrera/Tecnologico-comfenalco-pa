// src/app/models/docente-nivel-detalle-curso.model.ts
import { Docente } from './docente.model'; // Importar modelo relacionado
import { NivelDetalleCurso } from './NivelDetalleCurso.interface';

export interface DocenteNivelDetalleCurso {
  idDocenteNivelDetalleCurso: number;  // ID principal
  nivelDetalleCurso: NivelDetalleCurso; // Relación con NivelDetalleCurso
  docente: Docente; // Relación con Docente
  activo: boolean; // Estado del registro
  fechaRegistro?: Date; // Fecha opcional
}
