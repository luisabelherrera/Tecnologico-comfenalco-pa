import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { StudentSelectionDialogComponent } from 'src/app/components/prediciones/weka/dialogo/student-selection-dialog.component';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';

@Component({
  selector: 'app-weka-estudiantes',
  templateUrl: './weka-estudiantes.component.html',
  styleUrls: ['./weka-estudiantes.component.scss']
})
export class WekaEstudiantesComponent implements OnInit {
  pageSize = 5;
  pageIndex = 0;
  paginatedEstudiantes: Estudiante[] = [];
  filteredEstudiantes: Estudiante[] = [];
  selectedStudent: Estudiante | null = null;

  constructor(
    public dialogRef: MatDialogRef<StudentSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { estudiantes: Estudiante[] }
  ) {
    console.log('Estudiantes recibidos en el diálogo:', this.data.estudiantes);
  }

  ngOnInit(): void {
    this.filteredEstudiantes = [...this.data.estudiantes];
    this.updatePaginatedEstudiantes();
  }

  selectStudent(estudiante: Estudiante): void {
    this.selectedStudent = estudiante;
  }

  confirmSelection(): void {
    if (this.selectedStudent) {
      this.dialogRef.close(this.selectedStudent);
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedEstudiantes();
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim().toLowerCase();
    
    if (!filterValue) {
      this.filteredEstudiantes = [...this.data.estudiantes];
    } else {
      this.filteredEstudiantes = this.data.estudiantes.filter(estudiante => 
        estudiante.nombres.toLowerCase().includes(filterValue) || 
        estudiante.apellidos.toLowerCase().includes(filterValue) ||
        estudiante.documentoIdentidad.toLowerCase().includes(filterValue)
      );
    }
    
    this.pageIndex = 0;
    this.updatePaginatedEstudiantes();
  }

  getInitials(nombres: string, apellidos: string): string {
    const firstNameInitial = nombres.charAt(0);
    const lastNameInitial = apellidos.charAt(0);
    return `${firstNameInitial}${lastNameInitial}`;
  }

  private updatePaginatedEstudiantes(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedEstudiantes = this.filteredEstudiantes.slice(startIndex, endIndex);
  }
}