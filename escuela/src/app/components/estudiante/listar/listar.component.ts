import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';

@Component({
  selector: 'app-listar-estudiantes',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarEstudiantesComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'codigo',
    'nombres',
    'apellidos',
    'documentoIdentidad',
    'fechaNacimiento',
    'sexo',
    'ciudad',
    'direccion',
    'activo',
    'acciones'
  ];
  dataSource = new MatTableDataSource<Estudiante>([]);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private estudianteService: EstudianteService) { }

  ngOnInit(): void {
    this.loadEstudiantes();
  }

  loadEstudiantes(): void {
    this.estudianteService.getAllEstudiantes().subscribe(
      (data) => {
        this.dataSource.data = data; // Set data to data source
        this.dataSource.paginator = this.paginator; // Assign paginator to data source
      },
      (error) => console.error(error)
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  deleteEstudiante(id: number): void {
    this.estudianteService.deleteEstudiante(id).subscribe(() => {
      this.loadEstudiantes(); // Recargar la lista después de eliminar
    });
  }
}
