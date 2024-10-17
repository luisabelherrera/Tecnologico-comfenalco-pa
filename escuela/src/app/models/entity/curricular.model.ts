import { DocenteNivelDetalleCurso } from "./docente-nivel-detalle-curso.model";

export class Curricular {
  idCurricular?: number; 
  descripcion: string;
  activo: boolean;
  fechaRegistro: Date;
  docenteNivelDetalleCurso?: DocenteNivelDetalleCurso; 

  constructor(
    descripcion: string = '', 
    activo: boolean = true, 
    fechaRegistro: Date = new Date(),
    docenteNivelDetalleCurso?: DocenteNivelDetalleCurso, 
    idCurricular?: number 
  ) {
    this.descripcion = descripcion;
    this.activo = activo;
    this.fechaRegistro = fechaRegistro;
    this.docenteNivelDetalleCurso = docenteNivelDetalleCurso; 
    if (idCurricular) {
      this.idCurricular = idCurricular;
    }
  }
}
