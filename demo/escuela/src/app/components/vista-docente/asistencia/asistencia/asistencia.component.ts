import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { DocenteNivelDetalleCurso } from 'src/app/models/entity/docente-nivel-detalle-curso.model';
import { UserDto } from 'src/app/models/models';
import { Asistencia, EstudianteAsistencia, AsistenciaService } from 'src/app/services/Docente/Docente-asistencia/docente-asistencia.service';
import { DocenteNivelDetalleCursoService } from 'src/app/services/docente-detalle/docente-nivel-detalle-curso.service';
import { InscripcionService } from 'src/app/services/matricula/matricula.service';
import { DocentePerfilService } from 'src/app/services/Docente/Docente-perfil/docente-perfil.service';
import { HistorialAsistenciaComponent } from '../historial-asistencia/historial-asistencia/historial-asistencia.component';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.scss']
})
export class AsistenciaComponent implements OnInit, AfterViewInit {
  // Propiedades
  docente?: UserDto;
  cursosAsignados: DocenteNivelDetalleCurso[] = [];
  estudiantesPorCurso: { [cursoId: number]: EstudianteAsistencia[] } = {};
  dataSource = new MatTableDataSource<EstudianteAsistencia>([]);
  displayedColumns: string[] = ['estudiante', 'documento', 'asistenciaHoy', 'historial', 'acciones'];
  selectedCurso: DocenteNivelDetalleCurso | null = null;
  today: Date = new Date();
  historialAsistencias: { [estudianteId: number]: Asistencia[] } = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Constructor
  constructor(
    private asistenciaService: AsistenciaService,
    private docentePerfilService: DocentePerfilService,
    private docenteNivelDetalleCursoService: DocenteNivelDetalleCursoService,
    private inscripcionService: InscripcionService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  // Lifecycle Hooks
  ngOnInit(): void {
    this.loadDocenteYDatos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // Métodos de Carga de Datos
  loadDocenteYDatos(): void {
    this.docentePerfilService.getPerfilDocente().subscribe(
      (data) => {
        this.docente = data;
        console.log('Perfil del docente:', this.docente);
        this.loadCursosYAsistencias();
      },
      (error) => {
        this.snackBar.open('Error al obtener el perfil del docente', 'Cerrar', { duration: 5000 });
        console.error('Error al obtener el perfil del docente:', error);
      }
    );
  }

  loadCursosYAsistencias(): void {
    if (!this.docente?.docente?.idDocente) return;

    this.docenteNivelDetalleCursoService.getAll().subscribe(
      (cursosData) => {
        this.cursosAsignados = cursosData.filter(
          (dndc) => dndc.docente.idDocente === this.docente?.docente?.idDocente
        );
        console.log('Cursos asignados al docente:', this.cursosAsignados);
        this.loadEstudiantesYAsistenciasPorCurso();
      },
      (error) => {
        this.snackBar.open('Error al cargar cursos asignados', 'Cerrar', { duration: 5000 });
        console.error('Error al obtener cursos asignados:', error);
      }
    );
  }

  loadEstudiantesYAsistenciasPorCurso(): void {
    this.cursosAsignados.forEach((curso) => {
      const nivelDetalleCursoId = curso.nivelDetalleCurso.idNivelDetalleCurso;

      this.asistenciaService.getAsistenciasPorCurso(nivelDetalleCursoId).subscribe(
        (asistencias) => {
          this.inscripcionService.getAllInscripciones().subscribe(
            (inscripciones) => {
              const estudiantes = inscripciones
                .filter(ins => ins.nivelDetalle?.idNivelDetalle === curso.nivelDetalleCurso.nivelDetalle?.idNivelDetalle)
                .map(ins => ins.estudiante);

              this.mapearAsistencias(nivelDetalleCursoId, estudiantes, asistencias);
              if (this.selectedCurso?.nivelDetalleCurso.idNivelDetalleCurso === nivelDetalleCursoId) {
                this.dataSource.data = this.estudiantesPorCurso[nivelDetalleCursoId] || [];
                this.cdr.detectChanges();
              }
            },
            (error) => {
              this.snackBar.open('Error al cargar inscripciones', 'Cerrar', { duration: 5000 });
              console.error('Error al obtener inscripciones:', error);
            }
          );
        },
        (error) => {
          this.snackBar.open('Error al cargar asistencias', 'Cerrar', { duration: 5000 });
          console.error('Error al obtener asistencias:', error);
        }
      );
    });
  }

  private mapearAsistencias(nivelDetalleCursoId: number, estudiantes: Estudiante[], asistencias: Asistencia[]): void {
    this.estudiantesPorCurso[nivelDetalleCursoId] = estudiantes.map((est) => {
      const asistenciaHoy = asistencias.find(
        (a) => a.estudiante.idEstudiante === est.idEstudiante && 
               new Date(a.fecha).toDateString() === this.today.toDateString()
      );
      this.historialAsistencias[est.idEstudiante] = asistencias.filter(
        (a) => a.estudiante.idEstudiante === est.idEstudiante
      );
      return {
        estudiante: est,
        asistencia: asistenciaHoy,
        asistio: asistenciaHoy ? asistenciaHoy.asistio : true // Valor inicial si no hay registro
      };
    });
  }

  // Métodos de Acción
  selectCurso(curso: DocenteNivelDetalleCurso): void {
    this.selectedCurso = curso;
    this.dataSource.data = this.estudiantesPorCurso[curso.nivelDetalleCurso.idNivelDetalleCurso] || [];
    this.cdr.detectChanges();
  }

  guardarAsistencia(estudianteAsist: EstudianteAsistencia): void {
    if (!this.selectedCurso) {
      this.snackBar.open('Selecciona un curso primero.', 'Cerrar', { duration: 5000 });
      return;
    }

    const todayLocalDate = this.today.toISOString().split('T')[0];
    const nuevaAsistencia: Asistencia = {
      idAsistencia: estudianteAsist.asistencia?.idAsistencia,
      estudiante: { idEstudiante: estudianteAsist.estudiante.idEstudiante },
      nivelDetalleCurso: { idNivelDetalleCurso: this.selectedCurso.nivelDetalleCurso.idNivelDetalleCurso },
      asistio: estudianteAsist.asistio!,
      fecha: todayLocalDate,
      activo: true,
      fechaRegistro: estudianteAsist.asistencia?.fechaRegistro || new Date().toISOString()
    };

    console.log('JSON enviado al backend:', JSON.stringify(nuevaAsistencia));

    const request = nuevaAsistencia.idAsistencia
      ? this.asistenciaService.actualizarAsistencia(nuevaAsistencia)
      : this.asistenciaService.registrarAsistencia(nuevaAsistencia);

    request.subscribe(
      (savedAsistencia) => {
        estudianteAsist.asistencia = savedAsistencia;
        estudianteAsist.asistio = savedAsistencia.asistio;
        this.snackBar.open('Asistencia guardada con éxito', 'Cerrar', { duration: 2000 });
        this.loadEstudiantesYAsistenciasPorCurso(); // Recargar para actualizar el historial
      },
      (error) => {
        this.snackBar.open(`Error al guardar asistencia: ${error.message}`, 'Cerrar', { duration: 5000 });
        console.error('Error al guardar asistencia:', error);
      }
    );
  }

  verHistorial(estudianteId: number): void {
    const asistencias = this.historialAsistencias[estudianteId] || [];
    this.dialog.open(HistorialAsistenciaComponent, {
      width: '500px',
      data: asistencias
    });
  }
}