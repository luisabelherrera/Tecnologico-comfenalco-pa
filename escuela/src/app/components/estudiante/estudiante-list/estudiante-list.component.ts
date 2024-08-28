import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { Estudiante } from 'src/app/models/estudiante.model';

@Component({
  selector: 'app-estudiante-list',
  templateUrl: './estudiante-list.component.html',
  styleUrls: ['./estudiante-list.component.scss']
})
export class EstudianteListComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  displayedColumns: string[] = [
    'id', 'nombre', 'apellido', 'fechaNacimiento', 'grado', 'direccion', 
    'telefono', 'documento', 'tutor', 'actions'
  ];
  dataSource: MatTableDataSource<Estudiante>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private estudianteService: EstudianteService) { }

  ngOnInit(): void {
    this.estudianteService.getAllEstudiantes().subscribe(estudiantes => {
      this.estudiantes = estudiantes;
      this.dataSource = new MatTableDataSource(this.estudiantes);
      this.dataSource.paginator = this.paginator;
    });
  }

  

  deleteEstudiante(id: number): void {
    this.estudianteService.deleteEstudiante(id).subscribe(() => {
      this.estudiantes = this.estudiantes.filter(est => est.id !== id);
      this.dataSource.data = this.estudiantes;  
    });
  }
}
