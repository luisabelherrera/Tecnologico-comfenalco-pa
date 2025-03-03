import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Acudiente } from 'src/app/models/entity/Acudiente.interface';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { EstadoPago, Inscripcion } from 'src/app/models/entity/Inscripcion.interface';
import { AcudienteService } from 'src/app/services/acudiente/acudiente.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { InscripcionService } from 'src/app/services/matricula/matricula.service';
import { NivelDetalleService } from 'src/app/services/niveldetalle/NivelDetalle.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { InscripciondetalleComponent } from './dialog/incripciondetalle/incripciondetalle.component';
import { ExportDialogComponent } from './dialog/export-dialog/export-dialog.component';
import { AgregarEstudianteDialogComponent } from './dialog/agregar-estudiante-dialog/agregar-estudiante-dialog.component';
import { MatricularAcudienteDialogComponent } from './dialog/matricular-acudiente-dialog/matricular-acudiente-dialog.component';

@Component({
  selector: 'app-matricula',
  templateUrl: './matricula.component.html',
  styleUrls: ['./matricula.component.scss']
})
export class MatriculaComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  inscripciones: MatTableDataSource<Inscripcion> = new MatTableDataSource();
  nuevoInscripcion: Partial<Inscripcion> = {};
  estudiantes: Estudiante[] = [];
  acudientes: Acudiente[] = [];
  nivelesDetalle: any[] = [];
  loading: boolean = false;
  isEditing: boolean = false;
  showForm: boolean = true;
  private subscriptions: Subscription = new Subscription();
  totalElements: number = 0;
  totalPages: number = 0;
  estadosPago = Object.values(EstadoPago);

  constructor(
    private inscripcionService: InscripcionService,
    private estudianteService: EstudianteService,
    private acudienteService: AcudienteService,
    private nivelDetalleService: NivelDetalleService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.resetForm();
    this.inscripciones.filterPredicate = (data: Inscripcion, filter: string) => {
      return data.codigo.toLowerCase().includes(filter) ||
             (data.estudiante?.nombres + ' ' + data.estudiante?.apellidos).toLowerCase().includes(filter);
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleView(showForm: boolean): void {
    this.showForm = showForm;
    if (!showForm) {
      this.loadInscripciones();
    }
  }

  loadData(): void {
    this.loading = true;
    forkJoin([
      this.inscripcionService.getAllInscripciones(),
      this.estudianteService.getAllEstudiantes(),
      this.acudienteService.getAcudientes(0, 10),
      this.nivelDetalleService.getAll()
    ]).subscribe({
      next: ([inscripcionesData, estudiantesData, acudientesData, nivelesData]) => {
        this.inscripciones.data = inscripcionesData;
        this.estudiantes = estudiantesData;
        this.acudientes = acudientesData.content;
        this.nivelesDetalle = nivelesData;
        this.totalElements = acudientesData.totalElements;
        this.totalPages = acudientesData.totalPages;
        this.loading = false;
        this.inscripciones.paginator = this.paginator;
        this.generateCodigo(); // Generate code after loading data
      },
      error: (error) => {
        this.handleError('Error cargando los datos:', error);
        this.loading = false;
      }
    });
  }

  loadInscripciones(): void {
    this.loading = true;
    const loadSub = this.inscripcionService.getAllInscripciones().subscribe(
      (data: Inscripcion[]) => {
        this.inscripciones.data = data;
        this.loading = false;
        this.inscripciones.paginator = this.paginator;
      },
      (error) => {
        this.handleError('Error cargando inscripciones:', error);
        this.loading = false;
      }
    );
    this.subscriptions.add(loadSub);
  }

  // Generate incremental code with leading zeros (e.g., "000010")
  generateCodigo(): void {
    if (this.isEditing) return; // Don't generate a new code when editing

    const latestInscripcion = this.inscripciones.data
      .map(ins => parseInt(ins.codigo, 10))
      .sort((a, b) => b - a)[0] || 0;
    const newCode = latestInscripcion + 1;
    this.nuevoInscripcion.codigo = newCode.toString().padStart(6, '0'); // e.g., "000010"
    this.nuevoInscripcion.valorCodigo = newCode; // Store the numeric value if needed
  }

  openMatricularEstudiantesDialog(): void {
    const dialogRef = this.dialog.open(AgregarEstudianteDialogComponent, {
      data: { estudiantes: this.estudiantes }
    });
    dialogRef.afterClosed().subscribe((selectedEstudiante: Estudiante | null) => {
      if (selectedEstudiante) {
        this.nuevoInscripcion.estudiante = selectedEstudiante;
      }
    });
  }

  openMatricularAcudienteDialog(): void {
    const dialogRef = this.dialog.open(MatricularAcudienteDialogComponent, {
      data: { acudientes: this.acudientes }
    });
    dialogRef.afterClosed().subscribe((result: Acudiente | null) => {
      if (result) {
        this.nuevoInscripcion.acudiente = result;
      }
    });
  }

  openExportDialog(): void {
    const dialogRef = this.dialog.open(ExportDialogComponent, {
      data: { inscripciones: this.inscripciones.data }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'excel') {
        dialogRef.componentInstance.downloadExcel();
      }
    });
  }

  editInscripcion(inscripcion: Inscripcion): void {
    this.nuevoInscripcion = { ...inscripcion };
    this.isEditing = true;
    this.showForm = true;
  }

  update(): void {
    const updateSub = this.inscripcionService.updateInscripcion(this.nuevoInscripcion.idInscripcion!, this.nuevoInscripcion as Inscripcion).subscribe(
      (updatedInscripcion) => {
        const index = this.inscripciones.data.findIndex(ins => ins.idInscripcion === updatedInscripcion.idInscripcion);
        if (index !== -1) {
          this.inscripciones.data[index] = updatedInscripcion;
          this.inscripciones.data = [...this.inscripciones.data];
          this.inscripciones.paginator = this.paginator;
          this.snackBar.open('Inscripción actualizada exitosamente', 'Cerrar', { duration: 3000 });
        }
        this.resetForm();
        this.showForm = false;
        this.loadInscripciones();
      },
      (error) => {
        this.handleError('Error al actualizar inscripción:', error);
      }
    );
    this.subscriptions.add(updateSub);
  }

  create(): void {
    console.log('Datos enviados al crear:', this.nuevoInscripcion);
    const createSub = this.inscripcionService.createInscripcion(this.nuevoInscripcion as Inscripcion).subscribe(
      (inscripcion) => {
        this.inscripciones.data = [...this.inscripciones.data, inscripcion];
        this.snackBar.open('Inscripción agregada exitosamente', 'Cerrar', { duration: 3000 });
        this.resetForm();
        setTimeout(() => {
          this.showForm = false;
          this.loadInscripciones();
        }, 500);
      },
      (error) => {
        this.handleError('Error al agregar inscripción:', error);
      }
    );
    this.subscriptions.add(createSub);
  }

  delete(inscripcionId: number): void {
    const deleteSub = this.inscripcionService.deleteInscripcion(inscripcionId).subscribe(
      () => {
        this.inscripciones.data = this.inscripciones.data.filter(inscripcion => inscripcion.idInscripcion !== inscripcionId);
        this.snackBar.open('Inscripción eliminada exitosamente', 'Cerrar', { duration: 3000 });
      },
      (error) => {
        this.handleError('Error al eliminar inscripción:', error);
      }
    );
    this.subscriptions.add(deleteSub);
  }

  openDetail(inscripcion: Inscripcion): void {
    const dialogRef = this.dialog.open(InscripciondetalleComponent, {
      width: '400px',
      data: inscripcion
    });
    dialogRef.afterClosed().subscribe(() => {});
  }

  resetForm(): void {
    this.nuevoInscripcion = {
      valorCodigo: 0,
      codigo: '',
      situacion: '',
      nivelDetalle: this.nivelesDetalle.length > 0 ? this.nivelesDetalle[0] : null,
      estudiante: null,
      acudiente: null,
      institucionProcedencia: '',
      esRepitente: false,
      activo: true,
      fechaRegistro: new Date(),
      montoPago: 0,
      fechaPago: null,
      metodoPago: '',
      estadoPago: EstadoPago.PENDIENTE
    };
    this.isEditing = false;
    if (!this.isEditing) {
      this.generateCodigo(); // Generate new code when resetting form for creation
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.inscripciones.filter = filterValue.trim().toLowerCase();
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
}