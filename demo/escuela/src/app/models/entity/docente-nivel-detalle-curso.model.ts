
import { Docente } from './docente.model'; 
import { NivelDetalleCurso } from './NivelDetalleCurso.interface';

export interface DocenteNivelDetalleCurso {
  idDocenteNivelDetalleCurso: number;
  nivelDetalleCurso: NivelDetalleCurso;
  docente: Docente;
  activo: boolean;
  fechaRegistro?: Date; 
}
