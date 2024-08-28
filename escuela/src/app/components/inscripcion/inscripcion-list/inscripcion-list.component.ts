import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { InscripcionService } from 'src/app/services/inscripcion/inscripcion.service';
import { Inscripcion } from 'src/app/models/inscripcion.interface';

@Component({
  selector: 'app-inscripcion-list',
  templateUrl: './inscripcion-list.component.html',
  styleUrls: ['./inscripcion-list.component.scss']
})
export class InscripcionListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'estudiante', 'curso', 'fechaInscripcion', 'calificacion', 'acciones'];
  dataSource = new MatTableDataSource<Inscripcion>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private inscripcionService: InscripcionService) {}

  ngOnInit(): void {
    this.loadInscripciones();
  }

  loadInscripciones(): void {
    this.inscripcionService.getAllInscripciones().subscribe(inscripciones => {
      this.dataSource.data = inscripciones;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteInscripcion(id: number): void {
    this.inscripcionService.deleteInscripcion(id).subscribe(() => {
      this.loadInscripciones();
    });
  }
}
