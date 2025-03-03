import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { ChangeDetectorRef } from '@angular/core';
import { DialogoComponent } from '../../docente/dialogo/dialogo/dialogo.component';

@Component({
  selector: 'app-listar-estudiantes',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarEstudiantesComponent implements OnInit, AfterViewInit {
  estudiantes: Estudiante[] = [];
  dataSource = new MatTableDataSource<Estudiante>([]);
  selectedEstudiante: Estudiante | null = null;
  estudianteForm: FormGroup;
  showForm = false;
  pageSize: number = 5;
  pageIndex: number = 0;
  filterValue: string = '';
  displayedColumns: string[] = ['codigo', 'nombres', 'apellidos', 'documentoIdentidad', 'activo', 'acciones'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private estudianteService: EstudianteService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.estudianteForm = this.fb.group({
      idEstudiante: [null],
      valorCodigo: [null],
      codigo: [{ value: '', disabled: true }, Validators.required], // Disabled to prevent manual edits
      documentoIdentidad: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      sexo: [''],
      ciudad: ['', Validators.required],
      direccion: [''],
      activo: [true],
    });
  }

  ngOnInit(): void {
    this.loadEstudiantes();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.cdr.detectChanges();
  }

  toggleView(show: boolean) {
    this.showForm = show;
    if (show) {
      this.resetFormFields();
      if (!this.selectedEstudiante) {
        this.generateCodigo(); // Generar código para nuevo estudiante
      }
    } else {
      this.loadEstudiantes(); // Recargar lista al volver
    }
    this.cdr.detectChanges();
  }

  loadEstudiantes() {
    this.estudianteService.getAllEstudiantes().subscribe(
      (data: Estudiante[]) => {
        this.estudiantes = data;
        this.dataSource.data = data;
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
          this.paginator.length = data.length;
          this.paginator.pageIndex = 0;
        }
        this.applyFilter();
        this.cdr.detectChanges();
      },
      error => {
        this.snackBar.open('Error al cargar Estudiantes', 'Cerrar', { duration: 5000 });
        this.dataSource.data = [];
        this.cdr.detectChanges();
      }
    );
  }

  applyFilter() {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    if (this.paginator) {
      this.paginator.length = this.dataSource.filteredData.length;
      this.paginator.pageIndex = 0;
    }
    this.cdr.detectChanges();
  }

  toggleDetails(estudiante: Estudiante) {
    this.dialog.open(DialogoComponent, {
      width: '400px',
      data: estudiante
    });
  }

  onSelect(estudiante: Estudiante) {
    this.selectedEstudiante = estudiante;
    this.estudianteForm.patchValue(estudiante);
    this.showForm = true;
    this.cdr.detectChanges();
  }

  onSubmit() {
    if (this.estudianteForm.valid) {
      const formValue = { ...this.estudianteForm.getRawValue() }; // Use getRawValue to include disabled fields
      if (this.selectedEstudiante) {
        this.estudianteService.updateEstudiante(this.selectedEstudiante.idEstudiante, formValue).subscribe(
          () => {
            this.loadEstudiantes();
            this.resetForm();
            this.snackBar.open('Estudiante actualizado con éxito', 'Cerrar', { duration: 2000 });
          },
          error => {
            this.snackBar.open(`No se pudo actualizar el Estudiante: ${error}`, 'Cerrar', { duration: 5000 });
          }
        );
      } else {
        this.estudianteService.createEstudiante(formValue).subscribe(
          () => {
            this.loadEstudiantes();
            this.resetForm();
            this.snackBar.open('Estudiante creado con éxito', 'Cerrar', { duration: 2000 });
          },
          error => {
            this.snackBar.open(`No se pudo crear el Estudiante: ${error}`, 'Cerrar', { duration: 5000 });
          }
        );
      }
    }
  }

  deleteEstudiante(id: number): void {
    this.estudianteService.deleteEstudiante(id).subscribe(
      () => {
        this.loadEstudiantes();
        this.resetForm();
        this.snackBar.open('Estudiante eliminado con éxito', 'Cerrar', { duration: 2000 });
      },
      error => {
        this.snackBar.open(`No se pudo eliminar el Estudiante: ${error}`, 'Cerrar', { duration: 5000 });
      }
    );
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cdr.detectChanges();
  }

  resetForm() {
    this.selectedEstudiante = null;
    this.estudianteForm.reset({
      activo: true,
    });
    this.showForm = false;
    this.cdr.detectChanges();
  }

  resetFormFields() {
    this.selectedEstudiante = null;
    this.estudianteForm.reset({
      activo: true,
    });
    this.cdr.detectChanges();
  }

  generateCodigo() {
    const latestCode = this.estudiantes
      .map(e => parseInt(e.codigo, 10))
      .filter(code => !isNaN(code))
      .sort((a, b) => b - a)[0] || 0;
    const newCode = (latestCode + 1).toString().padStart(5, '0'); // e.g., "00004"
    this.estudianteForm.get('codigo')?.setValue(newCode);
  }
}