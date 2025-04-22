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

    const marginX = 40;
    const marginY = 40;
    const logoWidth = 80;
    const logoHeight = 40;
    const lineSpacing = 25;

    logo.onload = () => {
      try {
      // Header Section
      doc.addImage(logo, 'JPEG', marginX, marginY, logoWidth, logoHeight);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(0, 51, 102);
      doc.text('INSTITUCION EDUCATIVA EL EDUPORTAL', doc.internal.pageSize.width / 2, marginY + 20, { align: 'center' });
      doc.setFontSize(12);
      doc.text('NIT: 123456789', doc.internal.pageSize.width / 2, marginY + 40, { align: 'center' });
      doc.text('CARMEN DE BOLIVAR', doc.internal.pageSize.width / 2, marginY + 60, { align: 'center' });

      // Title
      doc.setFontSize(22);
      doc.setTextColor(0, 102, 204);
      doc.text('BOLETÍN DE CALIFICACIONES', doc.internal.pageSize.width / 2, marginY + 100, { align: 'center' });
      doc.line(marginX, marginY + 110, doc.internal.pageSize.width - marginX, marginY + 110);

      let currentY = marginY + 150;

      // Student Information Section
      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.setFont('helvetica', 'bold');
      doc.text('INFORMACIÓN DEL ESTUDIANTE', marginX, currentY);
      currentY += lineSpacing;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(`Nombre Completo: ${calificacion.estudiante.nombres} ${calificacion.estudiante.apellidos}`, marginX, currentY);
      currentY += lineSpacing;
      doc.text(`Documento: ${calificacion.estudiante.documentoIdentidad}`, marginX, currentY);
      currentY += lineSpacing;
      doc.text(`Ciudad: ${calificacion.estudiante.ciudad}`, marginX, currentY);

      currentY += lineSpacing * 2;

      // Academic Information
      doc.setFontSize(14);
      doc.setTextColor(0, 51, 102);
      doc.setFont('helvetica', 'bold');
      doc.text('INFORMACIÓN ACADÉMICA', marginX, currentY);
      currentY += lineSpacing;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(`Curso: ${calificacion.curricular.docenteNivelDetalleCurso.nivelDetalleCurso.curso.descripcion}`, marginX, currentY);
      currentY += lineSpacing;
      doc.text(`Docente: ${calificacion.curricular.docenteNivelDetalleCurso.docente.nombres} ${calificacion.curricular.docenteNivelDetalleCurso.docente.apellidos}`, marginX, currentY);

      currentY += lineSpacing * 2;

      // Grade Information
      doc.setFontSize(16);
      doc.setTextColor(0, 51, 102);
      doc.setFont('helvetica', 'bold');
      doc.text('CALIFICACIÓN', doc.internal.pageSize.width / 2, currentY, { align: 'center' });
      currentY += lineSpacing;
      doc.setFontSize(24);
      doc.setTextColor(0, 102, 0);
      doc.text(`${calificacion.nota}`, doc.internal.pageSize.width / 2, currentY, { align: 'center' });

      currentY += lineSpacing * 2;

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128);
      doc.setFont('helvetica', 'italic');
      const fecha = new Date().toLocaleDateString();
      doc.text(`Fecha de emisión: ${fecha}`, marginX, doc.internal.pageSize.height - 40);
      doc.text('Este documento es de carácter informativo', doc.internal.pageSize.width - marginX, doc.internal.pageSize.height - 40, { align: 'right' });

      // Save the PDF
      doc.save(`boletin_${calificacion.estudiante.apellidos}_${calificacion.estudiante.nombres}.pdf`);
      } catch (error) {
      console.error('Error al generar PDF:', error);
      doc.text('Error al generar el PDF.', marginX, marginY);
      doc.save('boletin_error.pdf');
      }
    };

    logo.onerror = () => {
      console.error('Error loading the image');
      doc.text('Error al cargar el logo.', marginX, marginY);
      doc.save('boletin_calificaciones_error.pdf');
    };
  }
}
