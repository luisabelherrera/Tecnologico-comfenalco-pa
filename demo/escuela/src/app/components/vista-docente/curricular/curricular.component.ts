import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ChangeDetectorRef } from '@angular/core';
import { Calificacion } from 'src/app/models/entity/Calificacion.interface';
import { Curricular } from 'src/app/models/entity/curricular.model';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { DocenteNivelDetalleCurso } from 'src/app/models/entity/docente-nivel-detalle-curso.model';
import { UserDto } from 'src/app/models/models';
import { CalificacionService } from 'src/app/services/calificacion/calificacion.service';
import { CurricularService } from 'src/app/services/curricular/curricular.service';
import { DocenteNivelDetalleCursoService } from 'src/app/services/docente-detalle/docente-nivel-detalle-curso.service';
import { InscripcionService } from 'src/app/services/matricula/matricula.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DocentePerfilService } from 'src/app/services/Docente/Docente-perfil/docente-perfil.service';

interface EstudianteCalificacion {
  estudiante: Estudiante;
  calificacion?: Calificacion;
  nuevaNota?: number;
}

@Component({
  selector: 'app-curricular-docente',
  templateUrl: './curricular.component.html',
  styleUrls: ['./curricular.component.scss']
})
export class CurricularDocenteComponent implements OnInit, AfterViewInit {
  docente?: UserDto;
  curriculares: Curricular[] = [];
  estudiantesPorCurricular: { [curricularId: number]: EstudianteCalificacion[] } = {};
  calificaciones: Calificacion[] = [];
  docentesNivelDetalleCurso: DocenteNivelDetalleCurso[] = [];
  dataSource = new MatTableDataSource<EstudianteCalificacion>([]);
  selectedCurricular: Curricular | null = null;
  curricularForm: FormGroup;
  showForm = false;
  displayedColumns: string[] = ['estudiante', 'documento', 'nota', 'acciones'];
  pageSize: number = 5;
  pageIndex: number = 0;
  today: Date = new Date();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('printReporteContent') printReporteContent!: ElementRef;

  constructor(
    private calificacionService: CalificacionService,
    private curricularService: CurricularService,
    private docentePerfilService: DocentePerfilService,
    private docenteNivelDetalleCursoService: DocenteNivelDetalleCursoService,
    private inscripcionService: InscripcionService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.curricularForm = this.fb.group({
      idCurricular: [null],
      descripcion: ['', Validators.required],
      docenteNivelDetalleCurso: [null, Validators.required],
      activo: [true],
      fechaRegistro: [new Date()],
    });
  }

  ngOnInit(): void {
    this.loadDocenteYDatos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cdr.detectChanges();
  }

  loadDocenteYDatos(): void {
    this.docentePerfilService.getPerfilDocente().subscribe(
      (data) => {
        this.docente = data;
        console.log('Perfil del docente:', this.docente);
        this.loadAsignacionesYDatos();
      },
      (error) => {
        console.error('Error al obtener el perfil del docente:', error);
      }
    );
  }

  loadAsignacionesYDatos(): void {
    if (!this.docente?.docente?.idDocente) return;

    this.docenteNivelDetalleCursoService.getAll().subscribe(
      (docentesData) => {
        this.docentesNivelDetalleCurso = docentesData.filter(
          (dndc) => dndc.docente.idDocente === this.docente?.docente?.idDocente
        );
        console.log('Asignaciones del docente:', this.docentesNivelDetalleCurso);

        this.calificacionService.getCalificacionesByDocente(this.docente!.docente!.idDocente).subscribe(
          (calificacionesData) => {
            this.calificaciones = calificacionesData;
            console.log('Calificaciones del docente:', this.calificaciones);
            this.loadCurricularesYEstudiantes();
          },
          (error) => {
            console.error('Error al obtener calificaciones:', error);
          }
        );
      },
      (error) => {
        console.error('Error al obtener asignaciones:', error);
      }
    );
  }

  loadCurricularesYEstudiantes(): void {
    this.curricularService.getCurricularesPorDocente(this.docente!.docente!.idDocente).subscribe(
      (curricularesData) => {
        this.curriculares = curricularesData;
        console.log('Curriculares del docente:', this.curriculares);
        this.loadEstudiantesInscritos();
      },
      (error) => {
        console.error('Error al obtener curriculares:', error);
      }
    );
  }

  loadEstudiantesInscritos(): void {
    this.inscripcionService.getAllInscripciones().subscribe(
      (inscripciones) => {
        console.log('Inscripciones:', inscripciones);
        this.estudiantesPorCurricular = {};

        this.curriculares.forEach((curricular) => {
          if (!curricular.idCurricular || !curricular.docenteNivelDetalleCurso) return;

          // Obtener el nivel_detalle_curso asociado al curricular
          const nivelDetalleCursoId = curricular.docenteNivelDetalleCurso.nivelDetalleCurso.idNivelDetalleCurso;
          const nivelDetalleId = curricular.docenteNivelDetalleCurso.nivelDetalleCurso?.nivelDetalle?.idNivelDetalle;

          // Filtrar estudiantes inscritos en el nivel_detalle correspondiente
          const estudiantesInscritos = inscripciones
            .filter(ins => ins.nivelDetalle?.idNivelDetalle === nivelDetalleId)
            .map(ins => ins.estudiante);

          console.log(`Estudiantes inscritos para curricular ${curricular.idCurricular} (nivel_detalle ${nivelDetalleId}):`, estudiantesInscritos);

          const calificacionesCurricular = this.calificaciones.filter(
            (cal) => cal.curricular.idCurricular === curricular.idCurricular
          );

          this.estudiantesPorCurricular[curricular.idCurricular] = estudiantesInscritos.map((est) => {
            const calificacion = calificacionesCurricular.find(
              (cal) => cal.estudiante.idEstudiante === est.idEstudiante
            );
            return {
              estudiante: est,
              calificacion: calificacion,
              nuevaNota: calificacion?.nota,
            };
          });
        });
        console.log('Estudiantes por curricular:', this.estudiantesPorCurricular);
      },
      (error) => {
        console.error('Error al obtener inscripciones:', error);
        this.snackBar.open('Error al cargar estudiantes inscritos.', 'Cerrar', { duration: 5000 });
      }
    );
  }

  selectCurricular(curricular: Curricular): void {
    this.selectedCurricular = curricular;
    this.dataSource.data = this.estudiantesPorCurricular[curricular.idCurricular!] || [];
    this.cdr.detectChanges();
  }

  toggleForm(show: boolean): void {
    this.showForm = show;
    if (show) {
      this.curricularForm.reset({
        activo: true,
        fechaRegistro: new Date(),
      });
    }
    this.cdr.detectChanges();
  }

  onSubmitCurricular(): void {
    if (this.curricularForm.valid) {
      const formValue = this.curricularForm.value;
      if (formValue.idCurricular) {
        this.curricularService.updateCurricular(formValue.idCurricular, formValue).subscribe(
          () => {
            this.loadCurricularesYEstudiantes();
            this.toggleForm(false);
            this.snackBar.open('Curricular actualizado con éxito', 'Cerrar', { duration: 2000 });
          },
          (error) => {
            this.snackBar.open(`Error al actualizar curricular: ${error}`, 'Cerrar', { duration: 5000 });
          }
        );
      } else {
        this.curricularService.createCurricular(formValue).subscribe(
          () => {
            this.loadCurricularesYEstudiantes();
            this.toggleForm(false);
            this.snackBar.open('Curricular creado con éxito', 'Cerrar', { duration: 2000 });
          },
          (error) => {
            this.snackBar.open(`Error al crear curricular: ${error}`, 'Cerrar', { duration: 5000 });
          }
        );
      }
    }
  }

  guardarCalificacion(estudianteCal: EstudianteCalificacion): void {
    if (estudianteCal.nuevaNota === undefined || estudianteCal.nuevaNota < 0 || estudianteCal.nuevaNota > 5) {
      this.snackBar.open('La nota debe estar entre 0 y 5.', 'Cerrar', { duration: 5000 });
      return;
    }

    if (!this.selectedCurricular || !this.selectedCurricular.idCurricular) {
      this.snackBar.open('Selecciona un curricular primero.', 'Cerrar', { duration: 5000 });
      return;
    }

    const nuevaCalificacion: Calificacion = {
      idCalificacion: estudianteCal.calificacion?.idCalificacion,
      estudiante: estudianteCal.estudiante,
      curricular: this.selectedCurricular,
      nota: estudianteCal.nuevaNota,
      activo: true,
      fechaRegistro: estudianteCal.calificacion?.fechaRegistro || new Date(),
    };

    if (estudianteCal.calificacion && estudianteCal.calificacion.idCalificacion) {
      this.calificacionService.updateCalificacion(estudianteCal.calificacion.idCalificacion, nuevaCalificacion).subscribe(
        () => {
          this.snackBar.open('Calificación actualizada con éxito', 'Cerrar', { duration: 2000 });
          this.loadAsignacionesYDatos();
        },
        (error) => {
          this.snackBar.open(`Error al actualizar calificación: ${error}`, 'Cerrar', { duration: 5000 });
        }
      );
    } else {
      this.calificacionService.createCalificacion(nuevaCalificacion).subscribe(
        (savedCalificacion) => {
          estudianteCal.calificacion = savedCalificacion;
          this.snackBar.open('Calificación guardada con éxito', 'Cerrar', { duration: 2000 });
          this.loadAsignacionesYDatos();
        },
        (error) => {
          this.snackBar.open(`Error al guardar calificación: ${error}`, 'Cerrar', { duration: 5000 });
        }
      );
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cdr.detectChanges();
  }

  printReporte(): void {
    if (!this.printReporteContent || !this.printReporteContent.nativeElement) {
      this.snackBar.open('No hay contenido para imprimir.', 'Cerrar', { duration: 5000 });
      return;
    }

    const printContent = this.printReporteContent.nativeElement;
    html2canvas(printContent, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -pageHeight * (imgHeight / pageHeight - heightLeft / pageHeight), imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('Reporte_Calificaciones_Docente.pdf');
    }).catch((error) => {
      console.error('Error al generar el PDF:', error);
      this.snackBar.open('Error al generar el PDF.', 'Cerrar', { duration: 5000 });
    });
  }
}