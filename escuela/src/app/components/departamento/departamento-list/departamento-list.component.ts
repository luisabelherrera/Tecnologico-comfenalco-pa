import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Departamento } from 'src/app/models/departamento';
import { DepartamentoService } from 'src/app/services/deparamento/departamento.service';

@Component({
  selector: 'app-departamento-list',
  templateUrl: './departamento-list.component.html',
  styleUrls: ['./departamento-list.component.scss']
})
export class DepartamentoListComponent implements OnInit {
  departamentos: Departamento[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'acciones'];
  dataSource: MatTableDataSource<Departamento> = new MatTableDataSource<Departamento>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private departamentoService: DepartamentoService) { }

  ngOnInit(): void {
    this.loadDepartamentos();
  }

  loadDepartamentos(): void {
    this.departamentoService.getAllDepartamentos().subscribe(data => {
      this.departamentos = data;
      this.dataSource.data = this.departamentos;
      this.dataSource.paginator = this.paginator;
    });
  }

  deleteDepartamento(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este departamento?')) {
      this.departamentoService.deleteDepartamento(id).subscribe({
        next: () => {
          this.loadDepartamentos();
        },
        error: (error) => {
 
          alert(error.message);
        }
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
