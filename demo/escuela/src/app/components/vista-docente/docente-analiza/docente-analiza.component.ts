import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Chart } from 'chart.js/auto';
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
import { MaterialDocenteComponent } from './docente-crea-material/material-docente/material-docente.component';
import { EncuestaEstudianteService } from 'src/app/services/encuentasEstudiante/EncuestaEstudiante.service';

interface EstudiantePrediccion {
  estudiante: Estudiante;
  prediccion?: string;
  confianza?: number;
  nota?: number;
  showConfidence?: boolean;
  inputData?: {
    documento: number; // Changed to number
    edad: number;
    genero: string;
    promedioParciales: number;
    horasEstudioSemanal: number;
    asistencia: number;
    participacionClases: string;
    usoPlataformaVirtual: string;
    antecedentesPerdida: string;
    apoyoFamiliar: string;
    cargaAcademica: number;
    problemasPersonales: string;
  };
}

interface DatosEstudiante {
  documento: number; // Changed to number
  edad?: number;
  genero?: string;
  promedioParciales?: number;
  horasEstudioSemanal?: number;
  asistencia?: number;
  participacionClases?: string;
  usoPlataformaVirtual?: string;
  antecedentesPerdida?: string;
  apoyoFamiliar?: string;
  cargaAcademica?: number;
  problemasPersonales?: string;
  perderaAsignatura: string;
  confianza: string;
}

@Component({
  selector: 'app-docente-analiza',
  templateUrl: './docente-analiza.component.html',
  styleUrls: ['./docente-analiza.component.scss']
})
export class DocenteAnalizaComponent implements OnInit, OnDestroy, AfterViewInit {
  docente?: UserDto;
  curriculares: Curricular[] = [];
  estudiantesPorCurricular: { [curricularId: number]: EstudiantePrediccion[] } = {};
  selectedCurricular: Curricular | null = null;
  studentForm: FormGroup;
  resultado: string = '';
  displayedColumns: string[] = ['estudiante', 'documento', 'nota', 'prediccion', 'confianza', 'accion'];
  dataSource = new MatTableDataSource<EstudiantePrediccion>([]);
  historialPredicciones: DatosEstudiante[] = [];
  showForm: boolean = false;
  showTable: boolean = true;
  private gradeChart: Chart | undefined;
  promedioNotas: number | null = null;
  prediccionStats: { aprobados: number; reprobados: number; sinPredecir: number } = { aprobados: 0, reprobados: 0, sinPredecir: 0 };
  selectedPrediction: EstudiantePrediccion | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private curricularService: CurricularService,
    private docentePerfilService: DocentePerfilService,
    private docenteNivelDetalleCursoService: DocenteNivelDetalleCursoService,
    private inscripcionService: InscripcionService,
    private calificacionService: CalificacionService,
    private encuestaService: EncuestaEstudianteService
  ) {
    this.studentForm = this.fb.group({
      documento: ['', [Validators.required, Validators.pattern('^[0-9]{7,10}$')]],
      edad: ['', [Validators.required, Validators.min(5), Validators.pattern('^[0-9]+$')]],
      genero: ['', Validators.required],
      horasEstudioSemanal: ['', [Validators.required, Validators.min(0), Validators.pattern('^[0-9]+(\.[0-9]+)?$')]], // Allow decimals
      asistencia: ['', [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]+(\.[0-9]+)?$')]], // Allow decimals
      promedioParciales: ['', [Validators.required, Validators.min(0), Validators.max(5), Validators.pattern('^[0-9]+(\.[0-9]+)?$')]], // Allow decimals
      participacionClases: ['', Validators.required],
      usoPlataformaVirtual: ['', Validators.required],
      antecedentesPerdida: ['', Validators.required],
      apoyoFamiliar: ['', Validators.required],
      cargaAcademica: ['', [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]], // Allow integers
      problemasPersonales: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadHistorialPredicciones();
    this.loadDocenteYDatos();
  }

  ngAfterViewInit(): void {
    if (this.selectedCurricular) {
      this.updateGradeChart();
    }
  }

  ngOnDestroy(): void {
    this.gradeChart?.destroy();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
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
            .filter((ins) => ins.nivelDetalle?.idNivelDetalle === nivelDetalleId)
            .map((ins) => ins.estudiante);

          this.calificacionService.getCalificacionesPorCurricular(curricular.idCurricular!).subscribe(
            (calificaciones) => {
              Promise.all(
                estudiantesInscritos.map(async (est) => {
                  try {
                    const encuesta = await this.encuestaService.getEncuestaByEstudianteId(est.idEstudiante).toPromise();
                    est.encuesta = encuesta;
                  } catch (error) {
                    console.error('Error loading encuesta:', error);
                  }
                  return est;
                })
              ).then((estudiantesConEncuesta) => {
                this.estudiantesPorCurricular[curricular.idCurricular!] = estudiantesConEncuesta.map((est) => {
                  const prediccionGuardada = this.historialPredicciones.find(
                    (h) => h.documento === parseInt(est.documentoIdentidad, 10)
                  );
                  const calificacion = calificaciones.find((cal) => cal.estudiante.idEstudiante === est.idEstudiante);
                  return {
                    estudiante: est,
                    prediccion: prediccionGuardada?.perderaAsignatura,
                    confianza: prediccionGuardada ? parseFloat(prediccionGuardada.confianza.replace('%', '')) / 100 : undefined,
                    nota: calificacion?.nota,
                    showConfidence: false,
                    inputData: prediccionGuardada
                      ? {
                          documento: prediccionGuardada.documento,
                          edad: prediccionGuardada.edad || this.calculateAge(est.fechaNacimiento),
                          genero: prediccionGuardada.genero || (est.sexo === 'M' ? 'Masculino' : est.sexo === 'F' ? 'Femenino' : 'Otro'),
                          promedioParciales: prediccionGuardada.promedioParciales || (calificacion?.nota !== undefined ? calificacion.nota : 0),
                          horasEstudioSemanal: prediccionGuardada.horasEstudioSemanal || (est.encuesta?.horasEstudioSemanal || 0),
                          asistencia: prediccionGuardada.asistencia || (est.encuesta?.asistencia || 0),
                          participacionClases: prediccionGuardada.participacionClases || (est.encuesta?.participacionClases || ''),
                          usoPlataformaVirtual: prediccionGuardada.usoPlataformaVirtual || (est.encuesta?.usoPlataformaVirtual || ''),
                          antecedentesPerdida: prediccionGuardada.antecedentesPerdida || (est.encuesta?.antecedentesPerdida || ''),
                          apoyoFamiliar: prediccionGuardada.apoyoFamiliar || (est.encuesta?.apoyoFamiliar || ''),
                          cargaAcademica: prediccionGuardada.cargaAcademica || (est.encuesta?.cargaAcademica || 0),
                          problemasPersonales: prediccionGuardada.problemasPersonales || (est.encuesta?.problemasPersonales || '')
                        }
                      : undefined
                  };
                });

                if (this.selectedCurricular && this.selectedCurricular.idCurricular === curricular.idCurricular) {
                  this.updateTableData();
                }
              });
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
      const historial = await this.http.get<DatosEstudiante[]>('https://just-tenderness-production.up.railway.app/api/historial', { headers }).toPromise();
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
    this.selectedPrediction = null;
    this.updateTableData();
  }

  toggleView(showForm: boolean): void {
    if (!this.selectedCurricular) {
      this.snackBar.open('Por favor, selecciona un curricular primero.', 'Cerrar', { duration: 5000 });
      return;
    }

    this.showForm = showForm;
    this.showTable = !showForm;

    if (!this.showForm) {
      this.studentForm.reset();
      this.resultado = '';
      this.selectedPrediction = null;
    }

    if (this.showTable) {
      setTimeout(() => this.updateGradeChart(), 0);
    }
  }

  toggleTable(): void {
    this.showTable = !this.showTable;
    if (this.showTable) {
      setTimeout(() => this.updateGradeChart(), 0);
    }
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
      data: { estudiantes: estudiantes.map((e) => e.estudiante) }
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
      (e) => e.estudiante.documentoIdentidad === estudiante.documentoIdentidad
    );

    const encuesta = estudiante.encuesta || {};
    const formData = {
      documento: estudiante.documentoIdentidad,
      edad: edad || '',
      genero: estudiante.sexo === 'M' ? 'Masculino' : estudiante.sexo === 'F' ? 'Femenino' : 'Otro',
      promedioParciales: estudiantePred?.nota !== undefined ? estudiantePred.nota : '',
      horasEstudioSemanal: encuesta.horasEstudioSemanal || '',
      asistencia: encuesta.asistencia || '',
      participacionClases: encuesta.participacionClases || '',
      usoPlataformaVirtual: encuesta.usoPlataformaVirtual || '',
      antecedentesPerdida: encuesta.antecedentesPerdida || '',
      apoyoFamiliar: encuesta.apoyoFamiliar || '',
      cargaAcademica: encuesta.cargaAcademica || '',
      problemasPersonales: encuesta.problemasPersonales || ''
    };

    this.studentForm.patchValue(formData);
    this.studentForm.markAllAsTouched();

    if (estudiantePred) {
      estudiantePred.inputData = {
        documento: parseInt(estudiante.documentoIdentidad, 10),
        edad: edad || 0,
        genero: formData.genero,
        promedioParciales: parseFloat(formData.promedioParciales as string) || 0,
        horasEstudioSemanal: parseFloat(formData.horasEstudioSemanal as string) || 0,
        asistencia: parseFloat(formData.asistencia as string) || 0,
        participacionClases: formData.participacionClases,
        usoPlataformaVirtual: formData.usoPlataformaVirtual,
        antecedentesPerdida: formData.antecedentesPerdida,
        apoyoFamiliar: formData.apoyoFamiliar,
        cargaAcademica: parseInt(formData.cargaAcademica as string, 10) || 0,
        problemasPersonales: formData.problemasPersonales
      };
      console.log('InputData set in populateForm:', estudiantePred.inputData);
    }
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
    if (!this.selectedCurricular) {
      this.resultado = 'Por favor, selecciona un curricular primero.';
      this.snackBar.open(this.resultado, 'Cerrar', { duration: 5000 });
      return;
    }

    if (this.studentForm.invalid) {
      this.resultado = 'Por favor, completa todos los campos correctamente.';
      this.snackBar.open(this.resultado, 'Cerrar', { duration: 5000 });
      this.studentForm.markAllAsTouched();
      console.log('Form errors:', this.studentForm.errors);
      return;
    }

    const datos = this.studentForm.value;
    const estudiantePred = this.estudiantesPorCurricular[this.selectedCurricular.idCurricular!].find(
      (e) => e.estudiante.documentoIdentidad === datos.documento
    );

    const datosCompletos = {
      documento: parseInt(datos.documento, 10),
      edad: parseInt(datos.edad, 10) || 0,
      genero: datos.genero,
      horasEstudioSemanal: parseFloat(datos.horasEstudioSemanal) || 0,
      asistencia: parseFloat(datos.asistencia) || 0,
      promedioParciales: parseFloat(datos.promedioParciales) || 0,
      participacionClases: datos.participacionClases,
      usoPlataformaVirtual: datos.usoPlataformaVirtual,
      antecedentesPerdida: datos.antecedentesPerdida,
      apoyoFamiliar: datos.apoyoFamiliar,
      cargaAcademica: parseInt(datos.cargaAcademica, 10) || 0,
      problemasPersonales: datos.problemasPersonales,
      nota: estudiantePred?.nota !== undefined ? estudiantePred.nota : null
    };

    const headers = this.getHeaders();

    this.http.post('https://just-tenderness-production.up.railway.app/api/predecir', datosCompletos, { headers }).subscribe({
      next: (response: any) => {
        this.resultado = `Resultado: ${response.prediccion} (Confianza: ${response.confianza})`;
        if (estudiantePred) {
          estudiantePred.prediccion = response.prediccion;
          estudiantePred.confianza = parseFloat(response.confianza.replace('%', '')) / 100;
          estudiantePred.inputData = { ...datosCompletos };
          console.log('InputData after prediction:', estudiantePred.inputData);

          const prediccionData: DatosEstudiante = {
            ...datosCompletos,
            perderaAsignatura: response.prediccion,
            confianza: response.confianza
          };
          const existingPredictionIndex = this.historialPredicciones.findIndex(
            (h) => h.documento === datosCompletos.documento
          );
          if (existingPredictionIndex !== -1) {
            this.historialPredicciones[existingPredictionIndex] = prediccionData;
          } else {
            this.historialPredicciones.push(prediccionData);
          }

          this.updateTableData();
        }
        this.snackBar.open('Predicción realizada con éxito', 'Cerrar', { duration: 5000 });
      },
      error: (err) => {
        console.error('Error al predecir:', err);
        this.resultado = `Error: ${err.status} - ${err.error?.message || 'Error desconocido'}`;
        this.snackBar.open(this.resultado, 'Cerrar', { duration: 5000 });
      }
    });
  }

  openMaterialPanel(student: EstudiantePrediccion): void {
    const dialogRef = this.dialog.open(MaterialDocenteComponent, {
      width: 'min(1300px, 100vw)',
      height: 'min(800px, 100vh)',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: {
        estudiantePrediccion: student,
        curriculares: this.curriculares,
        curricularId: this.selectedCurricular?.idCurricular
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.material) {
        this.snackBar.open(
          `Material enviado a ${student.estudiante.nombres} ${student.estudiante.apellidos}`,
          'Cerrar',
          { duration: 3000 }
        );
        this.resultado = `Material enviado a ${student.estudiante.nombres} ${student.estudiante.apellidos}`;
      }
    });
  }

  showPredictionDetails(element: EstudiantePrediccion): void {
    this.selectedPrediction = element;
  }

  closePredictionDetails(): void {
    this.selectedPrediction = null;
  }

  toggleConfidence(element: EstudiantePrediccion): void {
    element.showConfidence = !element.showConfidence;
  }

  private updateTableData(): void {
    if (this.selectedCurricular && this.estudiantesPorCurricular[this.selectedCurricular.idCurricular!]) {
      this.dataSource.data = [...this.estudiantesPorCurricular[this.selectedCurricular.idCurricular!]];

      const notas = this.dataSource.data.map((e) => e.nota).filter((n) => n !== undefined) as number[];
      this.promedioNotas = notas.length > 0 ? notas.reduce((a, b) => a + b, 0) / notas.length : null;

      this.prediccionStats = {
        aprobados: this.dataSource.data.filter((e) => e.prediccion === 'tested_negative').length,
        reprobados: this.dataSource.data.filter((e) => e.prediccion === 'tested_positive').length,
        sinPredecir: this.dataSource.data.filter((e) => !e.prediccion).length
      };

      setTimeout(() => this.updateGradeChart(), 0);
    } else {
      this.dataSource.data = [];
      this.promedioNotas = null;
      this.prediccionStats = { aprobados: 0, reprobados: 0, sinPredecir: 0 };
      setTimeout(() => this.updateGradeChart(), 0);
    }
  }

  private updateGradeChart(): void {
    if (this.gradeChart) {
      this.gradeChart.destroy();
    }

    const canvas = document.getElementById('gradeChart') as HTMLCanvasElement;
    if (!canvas || this.dataSource.data.length === 0) return;

    const labels = this.dataSource.data.map((e) => `${e.estudiante.nombres} ${e.estudiante.apellidos}`);
    const notas = this.dataSource.data.map((e) => (e.nota !== undefined ? e.nota : 0));

    this.gradeChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Notas de Estudiantes',
            data: notas,
            backgroundColor: '#36A2EB',
            borderColor: '#1E88E5',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 5,
            title: { display: true, text: 'Nota' }
          },
          x: {
            title: { display: true, text: 'Estudiantes' }
          }
        },
        plugins: {
          legend: { position: 'top' },
          title: {
            display: true,
            text: `Distribución de Notas (Promedio: ${this.promedioNotas?.toFixed(2) || 'N/A'})`
          }
        }
      }
    });
  }
}