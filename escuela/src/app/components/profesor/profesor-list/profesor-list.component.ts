import { Component, OnInit, ViewChild } from '@angular/core';
import { ProfesorService } from 'src/app/services/profesor/profesor.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Profesor } from 'src/app/models/profesor';

@Component({
  selector: 'app-profesor-list',
  templateUrl: './profesor-list.component.html',
  styleUrls: ['./profesor-list.component.scss']
})
export class ProfesorListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'especialidad', 'telefono', 'email', 'departamento', 'acciones'];
  dataSource = new MatTableDataSource<Profesor>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private profesorService: ProfesorService) { }

  ngOnInit(): void {
    this.loadProfesores();
  }

  loadProfesores(): void {
    this.profesorService.getAllProfesores().subscribe(profesores => {
      this.dataSource.data = profesores;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteProfesor(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este profesor?')) {
      this.profesorService.deleteProfesor(id).subscribe(() => {
        this.loadProfesores();
      });
    }
  }
}
