import { DocenteNivelDetalleCurso } from "./docente-nivel-detalle-curso.model";

export class Curricular {
  idCurricular?: number;  // Opcional para nuevos registros
  descripcion: string;
  activo: boolean;
  fechaRegistro: Date;
  docenteNivelDetalleCurso?: DocenteNivelDetalleCurso; // Agregado para la relación

  constructor(
    descripcion: string = '', 
    activo: boolean = true, 
    fechaRegistro: Date = new Date(),
    docenteNivelDetalleCurso?: DocenteNivelDetalleCurso, // Opcional
    idCurricular?: number // Opcional
  ) {
    this.descripcion = descripcion;
    this.activo = activo;
    this.fechaRegistro = fechaRegistro;
    this.docenteNivelDetalleCurso = docenteNivelDetalleCurso; // Inicializa la relación
    if (idCurricular) {
      this.idCurricular = idCurricular;
    }
  }
}
