import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Calificacion } from 'src/app/models/entity/Calificacion.interface';
import { CalificacionService } from 'src/app/services/calificacion/calificacion.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-calificacion-list',
  templateUrl: './calificacion-list.component.html',
  styleUrls: ['./calificacion-list.component.scss']
})
export class CalificacionListComponent implements OnInit {
  calificaciones: Calificacion[] = [];
  dataSource = new MatTableDataSource<Calificacion>();
  displayedColumns: string[] = ['idCalificacion', 'nota', 'estudiante', 'curricular', 'fechaRegistro', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private calificacionService: CalificacionService, private router: Router) {}

  ngOnInit(): void {
    this.loadCalificaciones();
  }

  loadCalificaciones(): void {
    this.calificacionService.getCalificaciones().subscribe(
      (data) => {
        this.calificaciones = data;
        this.dataSource.data = this.calificaciones;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Error al cargar las calificaciones', error);
      }
    );
  }

  deleteCalificacion(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta calificación?')) {
      this.calificacionService.deleteCalificacion(id).subscribe(() => {
        this.loadCalificaciones();
      },
      (error) => {
        console.error('Error al eliminar la calificación', error);
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
