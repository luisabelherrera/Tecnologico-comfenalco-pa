import { Pipe, PipeTransform } from '@angular/core';
import { Calificacion } from 'src/app/models/entity/Calificacion.interface';

@Pipe({
  name: 'findCalificacion'
})
export class FindCalificacionPipe implements PipeTransform {
  transform(calificaciones: Calificacion[], idEstudiante: number): Calificacion | undefined {
    return calificaciones.find(calificacion => calificacion.estudiante.idEstudiante === idEstudiante);
  }
}