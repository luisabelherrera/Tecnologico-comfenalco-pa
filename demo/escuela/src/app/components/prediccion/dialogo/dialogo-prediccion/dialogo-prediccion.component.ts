import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DesempenoEstudiante } from 'src/app/models/entity/desempeno-estudiante.model';
import { NivelDetalleCurso } from 'src/app/models/entity/NivelDetalleCurso.interface';

@Component({
  selector: 'app-dialogo-prediccion',
  templateUrl: './dialogo-prediccion.component.html',
  styleUrls: ['./dialogo-prediccion.component.scss']
})
export class StudentSearchDialog implements OnInit {
  searchTerm: string = '';
  filteredDesempenos: DesempenoEstudiante[] = [];
  desempenos: DesempenoEstudiante[] = [];
  nivelDetalleCursos: NivelDetalleCurso[] = [];

  constructor(
    public dialogRef: MatDialogRef<StudentSearchDialog>,
    @Inject(MAT_DIALOG_DATA) private data: { desempenos: DesempenoEstudiante[], nivelDetalleCursos: NivelDetalleCurso[] }
  ) {
    this.desempenos = data.desempenos;
    this.nivelDetalleCursos = data.nivelDetalleCursos || [];
    this.filteredDesempenos = [...this.desempenos];
  }

  ngOnInit(): void {}

  filterStudents() {
    this.filteredDesempenos = this.desempenos.filter(d => 
      `${d.estudiante.nombres} ${d.estudiante.apellidos || ''} ${d.estudiante.idEstudiante}`
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase())
    );
  }

  selectStudent(d: DesempenoEstudiante) {
    this.dialogRef.close(d.idDesempeno);
  }

  getCursoDescripcion(nivelDetalleId?: number): string {
    if (!nivelDetalleId) return 'N/A';
    const nivelDetalleCurso = this.nivelDetalleCursos.find(ndc => ndc.nivelDetalle?.idNivelDetalle === nivelDetalleId);
    return nivelDetalleCurso?.curso?.descripcion || 'N/A';
  }

  willLoseCourse(d: DesempenoEstudiante): boolean {
    const result = this.predictIndividual(d);
    return result.prediction;
  }

  private predictIndividual(d: DesempenoEstudiante): { prediction: boolean } {
    if (d.asistencia <= 60) {
      if (d.promedioParciales <= 3.0) {
        if (d.participacionClases === 'Baja') {
          if (d.antecedentesPerdida === 'Sí') {
            return { prediction: true };
          } else {
            return { prediction: false };
          }
        } else {
          return { prediction: false };
        }
      } else {
        return { prediction: false };
      }
    } else {
      if (d.promedioParciales <= 2.5) {
        return { prediction: true };
      } else {
        return { prediction: false };
      }
    }
  }
}