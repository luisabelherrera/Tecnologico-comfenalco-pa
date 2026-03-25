import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Curso } from 'src/app/models/entity/curso.model';
import { CursosService } from 'src/app/services/curso/curso.service';

@Component({
  selector: 'app-cursos-list',
  templateUrl: './cursos-list.component.html',
  styleUrls: ['./cursos-list.component.scss']
})
export class CursosListComponent implements OnInit {
  cursos: Curso[] = [];
  dataSource = new MatTableDataSource<Curso>();
  displayedColumns: string[] = ['descripcion', 'activo', 'actions'];
  selectedCurso: Curso = { idCurso: 0, descripcion: '', activo: true, fechaRegistro: new Date() };
  isEditing = false;
  showForm: boolean = false; // Default to list view

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private cursosService: CursosService, private router: Router) {}

  ngOnInit(): void {
    this.loadCursos();
  }

  toggleView(showForm: boolean): void {
    this.showForm = showForm;
    if (!this.isEditing) {
      this.resetForm(); // Reset form when switching to form view unless editing
    }
  }

  loadCursos(): void {
    this.cursosService.getCursos().subscribe(
      (data) => {
        this.cursos = data;
        this.dataSource.data = this.cursos;
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error('Error al cargar los cursos', error);
      }
    );
  }

  createOrUpdate(): void {
    const request = this.isEditing
      ? this.cursosService.updateCurso(this.selectedCurso.idCurso, this.selectedCurso)
      : this.cursosService.createCurso(this.selectedCurso);

    request.subscribe({
      next: () => {
        this.loadCursos(); // Refresh list
        this.resetForm();
        this.showForm = false; // Switch to list view after create/update
      },
      error: (error) => {
        console.error('Error during create/update:', error);
      }
    });
  }

  editCurso(curso: Curso): void {
    this.selectedCurso = { ...curso };
    this.isEditing = true;
    this.showForm = true; // Switch to form view for editing
  }

  deleteCurso(idCurso: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este curso?')) {
      this.cursosService.deleteCurso(idCurso).subscribe(
        () => {
          this.loadCursos();
        },
        (error) => {
          console.error('Error al eliminar el curso', error);
        }
      );
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  resetForm(): void {
    this.selectedCurso = { idCurso: 0, descripcion: '', activo: true, fechaRegistro: new Date() };
    this.isEditing = false;
  }
}