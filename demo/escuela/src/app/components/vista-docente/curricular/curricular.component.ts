import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CurricularService } from 'src/app/services/curricular/curricular.service';
import { CalificacionService } from 'src/app/services/calificacion/calificacion.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Curricular } from 'src/app/models/entity/curricular.model';
import { Calificacion } from 'src/app/models/entity/Calificacion.interface';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { AuthService } from 'src/app/services/auth/AuthService.service';

@Component({
  selector: 'app-curricular-docente',
  templateUrl: './curricular.component.html',
  styleUrls: ['./curricular.component.scss']
})
export class CurricularDocenteComponent implements OnInit {
  curriculares: Curricular[] = [];
  dataSource = new MatTableDataSource<Curricular>();
  displayedColumns: string[] = ['descripcion', 'activo', 'fechaRegistro', 'actions'];

  estudiantesPorCurricular: { [key: number]: Estudiante[] } = {};
  calificacionesPorCurricular: { [key: number]: Calificacion[] } = {};
  showAssignGradeForm: { [key: number]: boolean } = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private curricularService: CurricularService,
    private calificacionService: CalificacionService,
    private authService: AuthService, // Servicio para obtener datos del usuario logueado
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurriculares();
  }

  loadCurriculares(): void {
    const idDocente = this.authService.getCurrentUserId(); // Obtener el ID del docente logueado
    this.curricularService.getCurricularesPorDocente(idDocente).subscribe(
      (data) => {
        this.curriculares = data;
        this.dataSource.data = this.curriculares;
        this.dataSource.paginator = this.paginator;

        // Cargar estudiantes y calificaciones para cada curricular
        this.curriculares.forEach(curricular => {
          this.loadEstudiantesPorCurricular(curricular.idCurricular);
          this.loadCalificacionesPorCurricular(curricular.idCurricular);
        });
      },
      (error) => {
        console.error('Error al cargar los curriculares', error);
        alert('Ocurrió un error al cargar los curriculares.');
      }
    );
  }

  loadEstudiantesPorCurricular(idCurricular: number): void {
    this.curricularService.getEstudiantesPorCurricular(idCurricular).subscribe(
      (userDtos) => {
        this.estudiantesPorCurricular[idCurricular] = userDtos
          .map(user => user.estudiante)
          .filter((estudiante): estudiante is Estudiante => estudiante !== null);
      },
      (error) => {
        console.error(`Error al cargar estudiantes para curricular ${idCurricular}`, error);
      }
    );
  }

  loadCalificacionesPorCurricular(idCurricular: number): void {
    this.calificacionService.getCalificacionesPorCurricular(idCurricular).subscribe(
      (calificaciones) => {
        this.calificacionesPorCurricular[idCurricular] = calificaciones;
      },
      (error) => {
        console.error(`Error al cargar calificaciones para curricular ${idCurricular}`, error);
      }
    );
  }

  toggleAssignGradeForm(idCurricular: number): void {
    this.showAssignGradeForm[idCurricular] = !this.showAssignGradeForm[idCurricular];
  }

  assignGrade(idCurricular: number, idEstudiante: number, nota: number): void {
    if (nota < 0 || nota > 5 || isNaN(nota)) {
      alert('La nota debe estar entre 0 y 5.');
      return;
    }

    const estudiante = this.estudiantesPorCurricular[idCurricular]?.find(e => e.idEstudiante === idEstudiante);
    if (!estudiante) {
      alert('Estudiante no encontrado.');
      return;
    }

    const calificacion: Calificacion = {
      curricular: this.curriculares.find(c => c.idCurricular === idCurricular)!,
      estudiante,
      nota,
      activo: true,
      fechaRegistro: new Date()
    };

    this.calificacionService.saveCalificacion(calificacion).subscribe(
      () => {
        alert('Nota asignada exitosamente.');
        this.loadCalificacionesPorCurricular(idCurricular);
      },
      (error) => {
        console.error('Error al asignar nota', error);
        alert('Ocurrió un error al asignar la nota.');
      }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCalificacionNota(idCurricular: number, idEstudiante: number): string {
    const calificaciones = this.calificacionesPorCurricular[idCurricular];
    const calificacion = calificaciones?.find(c => c.estudiante.idEstudiante === idEstudiante);
    return calificacion?.nota?.toString() || 'Sin asignar';
  }
}