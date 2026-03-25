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
  paginatedEstudiantes: Estudiante[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5; // Adjust as needed
  totalPages: number = 1;

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
        this.updatePagination();
      },
      error: (err) => {
        console.error('Error loading estudiantes:', err);
      }
    });
  }

  filterEstudiantes() {
    this.filteredEstudiantes = this.estudiantes.filter(est =>
      (est.documentoIdentidad?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       est.nombres?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
       est.apellidos?.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
    this.currentPage = 1; // Reset to first page on filter
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredEstudiantes.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedEstudiantes = this.filteredEstudiantes.slice(start, end);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  selectEstudiante(estudiante: Estudiante) {
    this.dialogRef.close(estudiante);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}