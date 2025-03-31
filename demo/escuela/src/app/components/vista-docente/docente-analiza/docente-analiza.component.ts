import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { Curricular } from 'src/app/models/entity/curricular.model';
import { DocenteNivelDetalleCurso } from 'src/app/models/entity/docente-nivel-detalle-curso.model';
import { UserDto } from 'src/app/models/models';
import { CurricularService } from 'src/app/services/curricular/curricular.service';
import { DocenteNivelDetalleCursoService } from 'src/app/services/docente-detalle/docente-nivel-detalle-curso.service';
import { InscripcionService } from 'src/app/services/matricula/matricula.service';
import { DocentePerfilService } from 'src/app/services/Docente/Docente-perfil/docente-perfil.service';
import { CalificacionService } from 'src/app/services/calificacion/calificacion.service';
import { WekaEstudiantesComponent } from './estudiante-weka/weka-estudiantes/weka-estudiantes.component';

interface EstudiantePrediccion {
  estudiante: Estudiante;
  prediccion?: string;
  confianza?: number;
  nota?: number;
}

interface DatosEstudiante {
  documento: string;
  perderaAsignatura: string;
  confianza: string;
}

@Component({
  selector: 'app-docente-analiza',
  templateUrl: './docente-analiza.component.html',
  styleUrls: ['./docente-analiza.component.scss']
})
export class DocenteAnalizaComponent implements OnInit {
  docente?: UserDto;
  curriculares: Curricular[] = [];
  estudiantesPorCurricular: { [curricularId: number]: EstudiantePrediccion[] } = {};
  selectedCurricular: Curricular | null = null;
  studentForm: FormGroup;
  resultado: string = '';
  displayedColumns: string[] = ['estudiante', 'documento', 'nota', 'prediccion', 'confianza'];
  dataSource = new MatTableDataSource<EstudiantePrediccion>([]);
  historialPredicciones: DatosEstudiante[] = [];
  showForm: boolean = false;
  showTable: boolean = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private curricularService: CurricularService,
    private docentePerfilService: DocentePerfilService,
    private docenteNivelDetalleCursoService: DocenteNivelDetalleCursoService,
    private inscripcionService: InscripcionService,
    private calificacionService: CalificacionService
  ) {
    this.studentForm = this.fb.group({
      documento: ['', [Validators.required, Validators.pattern('^[0-9]{7,10}$')]],
      edad: ['', [Validators.required, Validators.min(5)]],
      genero: ['', Validators.required],
      horasEstudioSemanal: ['', [Validators.required, Validators.min(0)]],
      asistencia: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      promedioParciales: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
      participacionClases: ['', Validators.required],
      usoPlataformaVirtual: ['', Validators.required],
      antecedentesPerdida: ['', Validators.required],
      apoyoFamiliar: ['', Validators.required],        // Nuevo
      cargaAcademica: ['', [Validators.required, Validators.min(1), Validators.max(5)]], // Nuevo
      problemasPersonales: ['', Validators.required]   // Nuevo
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadHistorialPredicciones();
    this.loadDocenteYDatos();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  loadDocenteYDatos(): void {
    this.docentePerfilService.getPerfilDocente().subscribe(
      (data) => {
        this.docente = data;
        this.loadAsignacionesYDatos();
      },
      (error) => {
        console.error('Error al obtener el perfil del docente:', error);
        this.snackBar.open('Error al cargar perfil del docente', 'Cerrar', { duration: 5000 });
      }
    );
  }

  loadAsignacionesYDatos(): void {
    if (!this.docente?.docente?.idDocente) return;

    this.docenteNivelDetalleCursoService.getAll().subscribe(
      (docentesData) => {
        const asignaciones = docentesData.filter(
          (dndc) => dndc.docente.idDocente === this.docente?.docente?.idDocente
        );
        this.loadCurriculares(asignaciones);
      },
      (error) => {
        console.error('Error al obtener asignaciones:', error);
      }
    );
  }

  loadCurriculares(asignaciones: DocenteNivelDetalleCurso[]): void {
    this.curricularService.getCurricularesPorDocente(this.docente!.docente!.idDocente).subscribe(
      (curricularesData) => {
        this.curriculares = curricularesData;
        this.loadEstudiantesInscritos(asignaciones);
      },
      (error) => {
        console.error('Error al obtener curriculares:', error);
      }
    );
  }

  loadEstudiantesInscritos(asignaciones: DocenteNivelDetalleCurso[]): void {
    this.inscripcionService.getAllInscripciones().subscribe(
      (inscripciones) => {
        this.estudiantesPorCurricular = {};

        this.curriculares.forEach((curricular) => {
          if (!curricular.idCurricular || !curricular.docenteNivelDetalleCurso) return;

          const nivelDetalleCursoId = curricular.docenteNivelDetalleCurso.nivelDetalleCurso.idNivelDetalleCurso;
          const nivelDetalleId = curricular.docenteNivelDetalleCurso.nivelDetalleCurso?.nivelDetalle?.idNivelDetalle;

          const estudiantesInscritos = inscripciones
            .filter(ins => ins.nivelDetalle?.idNivelDetalle === nivelDetalleId)
            .map(ins => ins.estudiante);

          this.calificacionService.getCalificacionesPorCurricular(curricular.idCurricular!).subscribe(
            (calificaciones) => {
              this.estudiantesPorCurricular[curricular.idCurricular!] = estudiantesInscritos.map((est) => {
                const prediccionGuardada = this.historialPredicciones.find(h => String(h.documento) === String(est.documentoIdentidad));
                const calificacion = calificaciones.find(cal => cal.estudiante.idEstudiante === est.idEstudiante);
                return {
                  estudiante: est,
                  prediccion: prediccionGuardada?.perderaAsignatura || undefined,
                  confianza: prediccionGuardada ? parseFloat(prediccionGuardada.confianza.replace('%', '')) / 100 : undefined,
                  nota: calificacion?.nota
                };
              });

              if (this.selectedCurricular && this.selectedCurricular.idCurricular === curricular.idCurricular) {
                this.updateTableData();
              }
            },
            (error) => {
              console.error('Error al cargar calificaciones:', error);
              this.snackBar.open('Error al cargar calificaciones.', 'Cerrar', { duration: 5000 });
            }
          );
        });
      },
      (error) => {
        console.error('Error al obtener inscripciones:', error);
        this.snackBar.open('Error al cargar estudiantes inscritos.', 'Cerrar', { duration: 5000 });
      }
    );
  }

  async loadHistorialPredicciones(): Promise<void> {
    const headers = this.getHeaders();
    try {
      const historial = await this.http.get<DatosEstudiante[]>('http://localhost:9098/api/historial', { headers }).toPromise();
      console.log('Historial recibido del backend:', historial);
      this.historialPredicciones = historial || [];
    } catch (error) {
      console.error('Error al cargar historial de predicciones:', error);
      this.snackBar.open('Error al cargar historial de predicciones', 'Cerrar', { duration: 5000 });
      this.historialPredicciones = [];
    }
  }

  selectCurricular(curricular: Curricular): void {
    this.selectedCurricular = curricular;
    this.studentForm.reset();
    this.resultado = '';
    this.showForm = false;
    this.showTable = true;
    this.updateTableData();
  }

  toggleForm(): void {
    if (!this.selectedCurricular) {
      this.snackBar.open('Por favor, selecciona un curricular primero.', 'Cerrar', { duration: 5000 });
      return;
    }
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.studentForm.reset();
      this.resultado = '';
    }
  }

  toggleTable(): void {
    if (!this.selectedCurricular) {
      this.snackBar.open('Por favor, selecciona un curricular primero.', 'Cerrar', { duration: 5000 });
      return;
    }
    this.showTable = !this.showTable;
  }

  openStudentSelectionDialog(): void {
    if (!this.selectedCurricular) {
      this.snackBar.open('Por favor, selecciona un curricular primero.', 'Cerrar', { duration: 5000 });
      return;
    }

    const estudiantes = this.estudiantesPorCurricular[this.selectedCurricular.idCurricular!] || [];
    if (estudiantes.length === 0) {
      this.snackBar.open('No hay estudiantes inscritos en este curricular.', 'Cerrar', { duration: 5000 });
      return;
    }

    const dialogRef = this.dialog.open(WekaEstudiantesComponent, {
      width: '600px',
      data: { estudiantes: estudiantes.map(e => e.estudiante) }
    });

    dialogRef.afterClosed().subscribe((result: Estudiante) => {
      if (result) {
        this.populateForm(result);
        this.showForm = true;
      }
    });
  }

  populateForm(estudiante: Estudiante): void {
    const edad = this.calculateAge(estudiante.fechaNacimiento);
    const estudiantePred = this.estudiantesPorCurricular[this.selectedCurricular!.idCurricular!].find(
      e => e.estudiante.documentoIdentidad === estudiante.documentoIdentidad
    );
    this.studentForm.patchValue({
      documento: estudiante.documentoIdentidad,
      edad: edad,
      genero: estudiante.sexo === 'M' ? 'Masculino' : estudiante.sexo === 'F' ? 'Femenino' : 'Otro',
      promedioParciales: estudiantePred?.nota !== undefined ? estudiantePred.nota : '',
      horasEstudioSemanal: '', // No hay datos previos, dejar vacío
      asistencia: '',
      participacionClases: '',
      usoPlataformaVirtual: '',
      antecedentesPerdida: '',
      apoyoFamiliar: '',
      cargaAcademica: '',
      problemasPersonales: ''
    });
  }

  calculateAge(fechaNacimiento?: Date): number {
    if (!fechaNacimiento) return 0;
    const today = new Date();
    const birthDate = new Date(fechaNacimiento);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  enviarDatos(): void {
    if (this.studentForm.valid && this.selectedCurricular) {
      const datos = this.studentForm.value;
      const estudiantePred = this.estudiantesPorCurricular[this.selectedCurricular.idCurricular!].find(
        e => e.estudiante.documentoIdentidad === datos.documento
      );
      const headers = this.getHeaders();

      const datosCompletos = {
        ...datos,
        nota: estudiantePred?.nota !== undefined ? estudiantePred.nota : null
      };

      this.http.post('http://localhost:9098/api/predecir', datosCompletos, { headers })
        .subscribe({
          next: (response: any) => {
            this.resultado = `Resultado: ${response.prediccion} (Confianza: ${response.confianza})`;
            if (estudiantePred) {
              estudiantePred.prediccion = response.prediccion;
              estudiantePred.confianza = parseFloat(response.confianza.replace('%', '')) / 100;

              const existingPredictionIndex = this.historialPredicciones.findIndex(
                h => String(h.documento) === String(datos.documento)
              );
              const prediccionData = {
                documento: datos.documento,
                perderaAsignatura: response.prediccion,
                confianza: response.confianza
              };
              if (existingPredictionIndex !== -1) {
                this.historialPredicciones[existingPredictionIndex] = prediccionData;
              } else {
                this.historialPredicciones.push(prediccionData);
              }

              this.updateTableData();
            }
          },
          error: (err) => {
            console.error('Error al predecir:', err);
            this.resultado = `Error: ${err.status} - ${err.error?.error || 'Error desconocido'}`;
          }
        });
    } else {
      this.resultado = 'Formulario inválido o no se ha seleccionado un curricular.';
    }
  }

  private updateTableData(): void {
    if (this.selectedCurricular && this.estudiantesPorCurricular[this.selectedCurricular.idCurricular!]) {
      this.dataSource.data = [...this.estudiantesPorCurricular[this.selectedCurricular.idCurricular!]];
    } else {
      this.dataSource.data = [];
    }
  }
}