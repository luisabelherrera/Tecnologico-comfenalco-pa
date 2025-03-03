import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Calificacion } from 'src/app/models/entity/Calificacion.interface';
import { Curricular } from 'src/app/models/entity/curricular.model';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { CalificacionService } from 'src/app/services/calificacion/calificacion.service';
import { CurricularService } from 'src/app/services/curricular/curricular.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion-list.component.html',
  styleUrls: ['./calificacion-list.component.scss']
})
export class CalificacionListComponent implements OnInit, AfterViewInit {
  calificaciones: Calificacion[] = [];
  dataSource = new MatTableDataSource<Calificacion>([]);
  selectedCalificacion: Calificacion | null = null;
  calificacionForm: FormGroup;
  showForm = false;
  pageSize: number = 5;
  pageIndex: number = 0;
  filterValue: string = '';
  displayedColumns: string[] = ['nota', 'estudiante', 'curricular', 'fechaRegistro', 'activo', 'acciones'];
  estudiantes: Estudiante[] = [];
  curriculares: Curricular[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private calificacionService: CalificacionService,
    private curricularService: CurricularService,
    private estudianteService: EstudianteService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.calificacionForm = this.fb.group({
      idCalificacion: [null],
      nota: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      estudiante: [null, Validators.required],
      curricular: [null, Validators.required],
      activo: [true],
      fechaRegistro: [new Date()]
    });
  }

  ngOnInit(): void {
    this.loadCalificaciones();
    this.loadEstudiantes();
    this.loadCurriculares();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cdr.detectChanges();
  }

  toggleView(show: boolean): void {
    this.showForm = show;
    if (show) {
      this.resetFormFields();
    }
    this.cdr.detectChanges();
  }

  loadCalificaciones(): void {
    this.calificacionService.getCalificaciones().subscribe(
      (data: Calificacion[]) => {
        this.calificaciones = data.map(cal => ({
          ...cal,
          fechaRegistro: typeof cal.fechaRegistro === 'string' ? new Date(cal.fechaRegistro) : cal.fechaRegistro,
          estudiante: {
            ...cal.estudiante,
            fechaNacimiento: typeof cal.estudiante.fechaNacimiento === 'string' ? new Date(cal.estudiante.fechaNacimiento) : cal.estudiante.fechaNacimiento
          }
        }));
        this.dataSource.data = this.calificaciones;
        this.applyFilter();
        this.cdr.detectChanges();
      },
      error => {
        this.snackBar.open('Error al cargar calificaciones', 'Cerrar', { duration: 5000 });
        this.dataSource.data = [];
        this.cdr.detectChanges();
      }
    );
  }

  loadEstudiantes(): void {
    this.estudianteService.getAllEstudiantes().subscribe(
      (data) => {
        this.estudiantes = data;
      },
      error => {
        this.snackBar.open('Error al cargar estudiantes', 'Cerrar', { duration: 5000 });
      }
    );
  }

  loadCurriculares(): void {
    this.curricularService.getCurriculares().subscribe(
      (data) => {
        this.curriculares = data;
      },
      error => {
        this.snackBar.open('Error al cargar curriculares', 'Cerrar', { duration: 5000 });
      }
    );
  }

  applyFilter(): void {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    if (this.paginator) {
      this.paginator.length = this.dataSource.filteredData.length;
      this.paginator.pageIndex = 0;
    }
    this.cdr.detectChanges();
  }

  viewDetails(id: number): void {
    this.router.navigate(['/calificaciones/detail', id]);
  }

  onSelect(calificacion: Calificacion): void {
    this.selectedCalificacion = calificacion;
    this.calificacionForm.patchValue(calificacion);
    this.showForm = true;
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    if (this.calificacionForm.valid) {
      const formValue = this.calificacionForm.value;
      if (this.selectedCalificacion && this.selectedCalificacion.idCalificacion) {
        this.calificacionService.updateCalificacion(this.selectedCalificacion.idCalificacion, formValue).subscribe(
          () => {
            this.loadCalificaciones();
            this.resetForm();
            this.snackBar.open('Calificación actualizada con éxito', 'Cerrar', { duration: 2000 });
          },
          error => {
            this.snackBar.open(`No se pudo actualizar la calificación: ${error}`, 'Cerrar', { duration: 5000 });
          }
        );
      } else {
        this.calificacionService.createCalificacion(formValue).subscribe(
          () => {
            this.loadCalificaciones();
            this.resetForm();
            this.snackBar.open('Calificación creada con éxito', 'Cerrar', { duration: 2000 });
          },
          error => {
            this.snackBar.open(`No se pudo crear la calificación: ${error}`, 'Cerrar', { duration: 5000 });
          }
        );
      }
    }
  }

  onDelete(calificacion: Calificacion): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta calificación?')) {
      this.calificacionService.deleteCalificacion(calificacion.idCalificacion).subscribe(
        () => {
          this.loadCalificaciones();
          this.resetForm();
          this.snackBar.open('Calificación eliminada con éxito', 'Cerrar', { duration: 2000 });
        },
        error => {
          this.snackBar.open(`No se pudo eliminar la calificación: ${error}`, 'Cerrar', { duration: 5000 });
        }
      );
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cdr.detectChanges();
  }

  resetForm(): void {
    this.selectedCalificacion = null;
    this.calificacionForm.reset({
      activo: true,
      fechaRegistro: new Date()
    });
    this.showForm = false;
    this.cdr.detectChanges();
  }

  resetFormFields(): void {
    this.selectedCalificacion = null;
    this.calificacionForm.reset({
      activo: true,
      fechaRegistro: new Date()
    });
    this.cdr.detectChanges();
  }

  printPDF(calificacion: Calificacion): void {
    const doc = new jsPDF('p', 'pt', 'a4');
    const logoPath = 'assets/OIP.jpg';
    const logo = new Image();
    logo.src = logoPath;

    const marginX = 20;
    const marginY = 20;
    const logoWidth = 50;
    const logoHeight = 20;
    const lineSpacing = 30;

    logo.onload = () => {
      try {
        doc.addImage(logo, 'JPEG', marginX, marginY, logoWidth, logoHeight);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text('NIT: 123456789', 70, marginY + 5);
        doc.text('Nombre de la Institución: INSTITUCION EDUCATIVA EL HOBO', 70, marginY + 25);
        doc.text('Dirección de la Institución: CARMEN DE BOLIVAR', 70, marginY + 45);

        doc.setFontSize(18);
        doc.setTextColor(40, 100, 200);
        doc.text('Boletín de Calificación', marginX, 80);
        doc.setDrawColor(40, 100, 200);
        doc.line(marginX, 83, 580, 83);

        let currentY = 100;
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Detalles de la Calificación:', marginX, currentY);
        currentY += lineSpacing;
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text(`1. ID de Calificación: ${calificacion.idCalificacion}`, marginX, currentY);
        currentY += lineSpacing;
        doc.text(`2. Nota: ${calificacion.nota.toString()}`, marginX, currentY);

        currentY += lineSpacing;
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Detalles del Estudiante:', marginX, currentY);
        currentY += lineSpacing;
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text(`1. Nombre: ${calificacion.estudiante.nombres} ${calificacion.estudiante.apellidos}`, marginX, currentY);
        currentY += lineSpacing;
        doc.text(`2. Documento de Identidad: ${calificacion.estudiante.documentoIdentidad}`, marginX, currentY);
        currentY += lineSpacing;
        const birthDate = calificacion.estudiante.fechaNacimiento instanceof Date
          ? calificacion.estudiante.fechaNacimiento.toLocaleDateString()
          : calificacion.estudiante.fechaNacimiento;
        doc.text(`3. Fecha de Nacimiento: ${birthDate}`, marginX, currentY);
        currentY += lineSpacing;
        doc.text(`4. Sexo: ${calificacion.estudiante.sexo}`, marginX, currentY);
        currentY += lineSpacing;
        doc.text(`5. Ciudad: ${calificacion.estudiante.ciudad}`, marginX, currentY);

        currentY += lineSpacing;
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Detalles Curriculares:', marginX, currentY);
        currentY += lineSpacing;
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text(`1. Descripción: ${calificacion.curricular.descripcion}`, marginX, currentY);
        currentY += lineSpacing;
        doc.text(`2. Activo: ${calificacion.curricular.activo ? 'Sí' : 'No'}`, marginX, currentY);

        currentY += lineSpacing;
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Detalles del Docente:', marginX, currentY);
        currentY += lineSpacing;
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text(`1. Nombre: ${calificacion.curricular.docenteNivelDetalleCurso.docente.nombres}`, marginX, currentY);
        currentY += lineSpacing;
        doc.text(`2. Apellido: ${calificacion.curricular.docenteNivelDetalleCurso.docente.apellidos}`, marginX, currentY);

        currentY += lineSpacing;
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Detalles del Curso:', marginX, currentY);
        currentY += lineSpacing;
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        doc.text(`1. Nombre del Curso: ${calificacion.curricular.docenteNivelDetalleCurso.nivelDetalleCurso.curso.descripcion}`, marginX, currentY);
        currentY += lineSpacing;
        doc.text(`2. Activo: ${calificacion.curricular.docenteNivelDetalleCurso.nivelDetalleCurso.curso.activo ? 'Sí' : 'No'}`, marginX, currentY);
        currentY += lineSpacing;
        const cursoFecha = calificacion.curricular.docenteNivelDetalleCurso.nivelDetalleCurso.curso.fechaRegistro instanceof Date
          ? calificacion.curricular.docenteNivelDetalleCurso.nivelDetalleCurso.curso.fechaRegistro.toLocaleDateString()
          : calificacion.curricular.docenteNivelDetalleCurso.nivelDetalleCurso.curso.fechaRegistro;
        doc.text(`3. Fecha de Registro: ${cursoFecha}`, marginX, currentY);

        currentY += lineSpacing;
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text('Fechas Importantes:', marginX, currentY);
        currentY += lineSpacing;
        doc.setFontSize(12);
        doc.setTextColor(60, 60, 60);
        const regDate = calificacion.curricular.fechaRegistro instanceof Date
          ? calificacion.curricular.fechaRegistro.toLocaleDateString()
          : calificacion.curricular.fechaRegistro;
        doc.text(`1. Fecha de Registro Curricular: ${regDate}`, marginX, currentY);
        currentY += lineSpacing;
        const califRegDate = calificacion.fechaRegistro instanceof Date
          ? calificacion.fechaRegistro.toLocaleDateString()
          : calificacion.fechaRegistro;
        doc.text(`2. Fecha de Registro de Calificación: ${califRegDate}`, marginX, currentY);

        doc.setDrawColor(40, 100, 200);
        currentY += lineSpacing;
        doc.line(marginX, currentY, 580, currentY);

        doc.save(`boletin_calificacion_${calificacion.idCalificacion}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
        doc.text('Error al generar el PDF.', marginX, marginY);
        doc.save('boletin_calificaciones_error.pdf');
      }
    };

    logo.onerror = () => {
      console.error('Error loading the image');
      doc.text('Error al cargar el logo.', marginX, marginY);
      doc.save('boletin_calificaciones_error.pdf');
    };
  }
}