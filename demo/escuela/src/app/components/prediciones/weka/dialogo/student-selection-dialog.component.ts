import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';

@Component({
  selector: 'app-student-selection-dialog',
  templateUrl: './student-selection-dialog.component.html',
  styleUrls: ['./student-selection-dialog.component.scss']
})
export class StudentSelectionDialogComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  filteredEstudiantes: Estudiante[] = [];
  searchTerm: string = '';

  constructor(
    private estudianteService: EstudianteService,
    public dialogRef: MatDialogRef<StudentSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.loadEstudiantes();
  }

  loadEstudiantes() {
    this.estudianteService.getAllEstudiantes().subscribe({
      next: (estudiantes) => {
        this.estudiantes = estudiantes;
        this.filteredEstudiantes = estudiantes;
      },
      error: (err) => {
        console.error('Error loading estudiantes:', err);
      }
    });
  }

  filterEstudiantes() {
    this.filteredEstudiantes = this.estudiantes.filter(est =>
      est.documentoIdentidad?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      est.nombres?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      est.apellidos?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectEstudiante(estudiante: Estudiante) {
    this.dialogRef.close(estudiante);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}