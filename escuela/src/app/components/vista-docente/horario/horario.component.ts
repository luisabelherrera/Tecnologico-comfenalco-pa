import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Horario } from 'src/app/models/entity/horario.model';
import { HorarioService } from 'src/app/services/horario/Horario.service';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.scss']
})
export class HorarioComponent implements OnInit {

  dataSource = new MatTableDataSource<Horario>(); 
  displayedColumns: string[] = ['diaSemana', 'horaInicio', 'horaFin', 'nivelDetalleCurso', 'acciones']; // Agregar nivelDetalleCurso

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort; 

  constructor(private horarioService: HorarioService) {}

  ngOnInit(): void {
    this.loadHorarios(); 
  }

  loadHorarios() {
    this.horarioService.getAllHorarios().subscribe(horarios => {
      this.dataSource.data = horarios; 
      this.dataSource.paginator = this.paginator; 
      this.dataSource.sort = this.sort; 
    });
  }

  deleteHorario(id: number) {
    this.horarioService.deleteHorario(id).subscribe(() => {
      this.loadHorarios(); 
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase(); 
  }
}
