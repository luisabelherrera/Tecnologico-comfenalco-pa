import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AsignacionAula } from 'src/app/models/AsignacionAula.interface';
import { AsignacionAulaService } from 'src/app/services/asignacion-aula/asignacion-aula.service';

@Component({
  selector: 'app-asignacion-aula-list',
  templateUrl: './asignacion-aula-list.component.html',
  styleUrls: ['./asignacion-aula-list.component.scss']
})
export class AsignacionAulaListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'curso', 'aula', 'diaSemana', 'horaInicio', 'horaFin', 'acciones'];
  dataSource = new MatTableDataSource<AsignacionAula>();

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Usar el operador `!`
  @ViewChild(MatSort) sort!: MatSort; // Usar el operador `!`

  constructor(private asignacionAulaService: AsignacionAulaService) { }

  ngOnInit(): void {
    this.loadAsignacionesAulas();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadAsignacionesAulas(): void {
    this.asignacionAulaService.getAllAsignacionesAulas().subscribe(data => {
      this.dataSource.data = data;
      // El paginator y sort se inicializan en ngAfterViewInit
    });
  }

  deleteAsignacionAula(id: number): void {
    this.asignacionAulaService.deleteAsignacionAula(id).subscribe(() => {
      this.loadAsignacionesAulas();
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
