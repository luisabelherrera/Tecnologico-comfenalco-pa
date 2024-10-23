import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-agregar-estudiante-dialog',
  templateUrl: './agregar-estudiante-dialog.component.html',
  styleUrls: ['./agregar-estudiante-dialog.component.scss']
})
export class AgregarEstudianteDialogComponent {
  selectedEstudiante: Estudiante | null = null;
  searchTerm: string = '';

  constructor(
    public dialogRef: MatDialogRef<AgregarEstudianteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { estudiantes: Estudiante[] }
  ) {}

  selectEstudiante(estudiante: Estudiante): void {
    this.selectedEstudiante = estudiante;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmSelection(): void {
    this.dialogRef.close(this.selectedEstudiante);
  }

  get filteredEstudiantes(): Estudiante[] {
    return this.data.estudiantes.filter(estudiante => 
      `${estudiante.nombres} ${estudiante.apellidos}`.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      estudiante.documentoIdentidad.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      estudiante.codigo.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
