import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Curricular } from 'src/app/models/entity/curricular.model';
import { CurricularService } from 'src/app/services/curricular/curricular.service';

@Component({
  selector: 'app-curricular',
  templateUrl: './curricular.component.html',
  styleUrls: ['./curricular.component.scss']
})
export class CurricularComponent implements OnInit {
  curriculares: Curricular[] = [];
  dataSource = new MatTableDataSource<Curricular>();
  displayedColumns: string[] = ['idCurricular', 'descripcion', 'activo', 'fechaRegistro', 'docente', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private curricularService: CurricularService, private router: Router) {}

  ngOnInit(): void {
    this.loadCurriculares();
  }

  loadCurriculares(): void {
    this.curricularService.getCurriculares().subscribe(
      (data) => {
        this.curriculares = data;
        this.dataSource.data = this.curriculares;
        this.dataSource.paginator = this.paginator;  // Vincula el paginador al dataSource
      },
      (error) => {
        console.error('Error al cargar los curriculares', error);
        alert('Ocurrió un error al cargar los curriculares.'); // Mensaje de error para el usuario
      }
    );
  }

  deleteCurricular(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este curricular?')) {
      this.curricularService.deleteCurricular(id).subscribe(() => {
        this.loadCurriculares(); 
      },
      (error) => {
        console.error('Error al eliminar el curricular', error);
        alert('Ocurrió un error al eliminar el curricular.'); // Mensaje de error para el usuario
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
