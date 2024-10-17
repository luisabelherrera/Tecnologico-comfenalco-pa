import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Curricular } from 'src/app/models/entity/curricular.model';
import { CurricularService } from 'src/app/services/curricular/curricular.service';

@Component({
  selector: 'app-curricular-estudiante',
  templateUrl: './curricular-estudiante.component.html',
  styleUrls: ['./curricular-estudiante.component.scss']
})
export class CurricularEstudianteComponent implements OnInit {

  curriculares: Curricular[] = [];
  dataSource = new MatTableDataSource<Curricular>();
  displayedColumns: string[] = ['idCurricular', 'descripcion', 'activo', 'fechaRegistro', 'docente', 'curso' ,'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private curricularService: CurricularService, 
    private router: Router,
    private snackBar: MatSnackBar  
  ) {}
  
  ngOnInit(): void {
    this.loadCurriculares();
  }
  isLoading = true;
  loadCurriculares(): void {
    this.curricularService.getCurriculares().subscribe(
      (data) => {
        this.curriculares = data;
        this.dataSource.data = this.curriculares;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;  
      },
      (error) => {
        this.isLoading = false; 
        console.error('Error al cargar los curriculares', error);
        alert('Ocurrió un error al cargar los curriculares.');
      }
    );
  }
  showNotification(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000,
    });
  }
  
deleteCurricular(id: number): void {
  if (confirm('¿Estás seguro de que quieres eliminar este curricular?')) {
    this.curricularService.deleteCurricular(id).subscribe(() => {
      this.loadCurriculares();
      this.showNotification('Curricular eliminado correctamente', 'Cerrar');
    },
    (error) => {
      console.error('Error al eliminar el curricular', error);
      this.showNotification('Error al eliminar el curricular', 'Cerrar');
    });
  }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
