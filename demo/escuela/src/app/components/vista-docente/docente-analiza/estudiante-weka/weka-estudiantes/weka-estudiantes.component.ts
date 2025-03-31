import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StudentSelectionDialogComponent } from 'src/app/components/prediciones/weka/dialogo/student-selection-dialog.component';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';

@Component({
  selector: 'app-weka-estudiantes',
  templateUrl: './weka-estudiantes.component.html',
  styleUrls: ['./weka-estudiantes.component.scss']
})
export class WekaEstudiantesComponent {

  constructor(
    public dialogRef: MatDialogRef<StudentSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { estudiantes: Estudiante[] }
  ) {
    console.log('Estudiantes recibidos en el diálogo:', this.data.estudiantes); // Para depuración
  }

  selectStudent(estudiante: Estudiante): void {
    this.dialogRef.close(estudiante);
  }
}