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
import { IncripciondetalleComponent } from './dialog/incripciondetalle/incripciondetalle.component';
import { ExportDialogComponent } from './dialog/export-dialog/export-dialog.component';
import { AgregarEstudianteDialogComponent } from './dialog/agregar-estudiante-dialog/agregar-estudiante-dialog.component';
import { MatricularAcudienteDialogComponent } from './dialog/matricular-acudiente-dialog/matricular-acudiente-dialog.component';

@Component({
  selector: 'app-matricula',
  templateUrl: './matricula.component.html',
  styleUrls: ['./matricula.component.scss']
})
export class MatriculaComponent implements OnInit, OnDestroy {
  inscripciones: MatTableDataSource<Inscripcion> = new MatTableDataSource();
  nuevoInscripcion: Partial<Inscripcion> = {};
  estudiantes: Estudiante[] = [];
  acudientes: Acudiente[] = [];
  nivelesDetalle: any[] = [];
  loading: boolean = false;
  isEditing: boolean = false;
  private subscriptions: Subscription = new Subscription();
  totalElements: number = 0; // Total de elementos
  totalPages: number = 0; 
  @ViewChild(MatPaginator) paginator: MatPaginator; 
  estadosPago = Object.values(EstadoPago);
  dataSource = new MatTableDataSource<any>([]);
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






  

  loadData(): void {
    this.loading = true;
  
    // Llamadas a las funciones asíncronas con forkJoin
    forkJoin([
      this.inscripcionService.getAllInscripciones(),
      this.estudianteService.getAllEstudiantes(),
      this.acudienteService.getAcudientes(0, 10),  // Aquí deberías pasar los valores correctos de paginación
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
      },
      error: (error) => {
        this.handleError('Error cargando los datos:', error);
        this.loading = false;
      }
    });
  }

  loadInscripciones(): void {
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

  openMatricularEstudiantesDialog(): void {
    console.log(this.acudientes);  
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
    // Asegúrate de que los acudientes están cargados antes de abrir el diálogo
    console.log(this.acudientes);  // Verifica que los datos estén disponibles
    const dialogRef = this.dialog.open(MatricularAcudienteDialogComponent, {
      data: { acudientes: this.acudientes }  // Asegúrate de pasar los datos completos
    });
  
    dialogRef.afterClosed().subscribe((result: Acudiente | null) => {
      if (result) {
        this.nuevoInscripcion.acudiente = result;  // Asigna el acudiente seleccionado
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
  
  loadEstudiantes(): void {
    const estudiantesSub = this.estudianteService.getAllEstudiantes().subscribe(
      (data: Estudiante[]) => {
        this.estudiantes = data;
      },
      (error) => {
        this.handleError('Error cargando estudiantes:', error);
      }
    );
    this.subscriptions.add(estudiantesSub);
  }
 
  loadAcudientes(page: number, size: number): void {
    this.acudienteService.getAcudientes(page, size).subscribe(
      (data: any) => {
        this.acudientes = data.content;  // Lista de acudientes
        this.totalElements = data.totalElements;  // Total de elementos
        this.totalPages = data.totalPages;  // Total de páginas
        this.dataSource.data = this.acudientes;  // Actualiza la fuente de datos de la tabla

        // Asegurarse de que el paginador se actualice correctamente
        if (this.paginator) {
          this.paginator.pageIndex = page; // Actualiza el índice de página
          this.paginator.pageSize = size;  // Asegura que el tamaño de página se mantenga
        }
      },
      (error) => {
        console.error('Error cargando acudientes:', error);
        this.snackBar.open('Error cargando acudientes', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    );
  }
  
  loadNivelesDetalle(): void {
    const nivelesSub = this.nivelDetalleService.getAll().subscribe(
      (data: any[]) => {
        this.nivelesDetalle = data;
      },
      (error) => {
        this.handleError('Error cargando niveles de detalle:', error);
      }
    );
    this.subscriptions.add(nivelesSub);
  }

  editInscripcion(inscripcion: Inscripcion): void {
    this.nuevoInscripcion = { ...inscripcion };
    this.isEditing = true; 
  }

  update(): void {
    const updateSub = this.inscripcionService.updateInscripcion(this.nuevoInscripcion.idInscripcion, this.nuevoInscripcion as Inscripcion).subscribe(
      (updatedInscripcion) => {
        const index = this.inscripciones.data.findIndex(ins => ins.idInscripcion === updatedInscripcion.idInscripcion);
        if (index !== -1) {
          this.inscripciones.data[index] = updatedInscripcion;
          this.inscripciones.data = [...this.inscripciones.data]; 
          this.inscripciones.paginator = this.paginator;
          this.snackBar.open('Inscripción actualizada exitosamente', 'Cerrar', { duration: 3000 });
        }
        this.resetForm();
      },
      (error) => {
        this.handleError('Error al actualizar inscripción:', error);
      }
    );
    this.subscriptions.add(updateSub);
  }

  openDetail(inscripcion: Inscripcion): void {
    const dialogRef = this.dialog.open(IncripciondetalleComponent, {
      width: '400px',
      data: inscripcion
    });
  
    dialogRef.afterClosed().subscribe(result => {
    
    });
  }

  create(): void {
    const createSub = this.inscripcionService.createInscripcion(this.nuevoInscripcion as Inscripcion).subscribe(
      (inscripcion) => {
        this.inscripciones.data = [...this.inscripciones.data, inscripcion];
        this.snackBar.open('Inscripción agregada exitosamente', 'Cerrar', { duration: 3000 });
        this.resetForm();
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
