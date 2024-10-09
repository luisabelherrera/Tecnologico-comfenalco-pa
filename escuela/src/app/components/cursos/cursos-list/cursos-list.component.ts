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
  displayedColumns: string[] = ['idCurso', 'descripcion', 'activo', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Add this line

  constructor(private cursosService: CursosService, private router: Router) {}

  ngOnInit(): void {
    this.loadCursos();
  }

  loadCursos(): void {
    this.cursosService.getCursos().subscribe(
      (data) => {
        this.cursos = data;
        this.dataSource.data = this.cursos; // Assign the data to dataSource
        this.dataSource.paginator = this.paginator; // Connect paginator to dataSource
      },
      (error) => {
        console.error('Error al cargar los cursos', error);
      }
    );
  }

  deleteCurso(idCurso: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este curso?')) {
      this.cursosService.deleteCurso(idCurso).subscribe(() => {
        this.loadCursos(); // Reload the list after deletion
      },
      (error) => {
        console.error('Error al eliminar el curso', error);
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
