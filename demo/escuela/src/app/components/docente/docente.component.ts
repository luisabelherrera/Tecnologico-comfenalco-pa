import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from '@angular/material/dialog';
import { Docente } from "src/app/models/entity/docente.model";
import { DocenteService } from "src/app/services/Docente/Docente.service";
import { ChangeDetectorRef } from '@angular/core';
import { DialogoComponent } from "./dialogo/dialogo/dialogo.component";

@Component({
  selector: 'app-docente',
  templateUrl: './docente.component.html',
  styleUrls: ['./docente.component.scss']
})
export class DocenteComponent implements OnInit, AfterViewInit {
  docentes: Docente[] = [];
  dataSource = new MatTableDataSource<Docente>([]);
  selectedDocente: Docente | null = null;
  docenteForm: FormGroup;
  showForm = false;
  pageSize: number = 5;
  pageIndex: number = 0;
  filterValue: string = '';
  displayedColumns: string[] = ['codigo', 'nombres', 'apellidos', 'email', 'activo', 'acciones'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private docenteService: DocenteService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.docenteForm = this.fb.group({
      idDocente: [null],
      valorCodigo: [null],
      codigo: [{ value: '', disabled: true }, Validators.required], // Disabled to prevent manual edits
      documentoIdentidad: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      sexo: [''],
      gradoEstudio: [''],
      ciudad: ['', Validators.required],
      direccion: [''],
      email: ['', [Validators.required, Validators.email]],
      numeroTelefono: ['', [Validators.required, Validators.pattern(/^\+?\d{1,3}\s?\d{7,}$/)]],
      activo: [true],
      fechaRegistro: [new Date()],

    });
  }

  ngOnInit(): void {
    this.loadDocentes();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.cdr.detectChanges();
  }

  toggleView(show: boolean) {
    this.showForm = show;
    if (show) {
      this.resetFormFields();
      if (!this.selectedDocente) {
        this.generateCodigo(); // Generate code when showing form for new docente
      }
    }
    this.cdr.detectChanges();
  }

  loadDocentes() {
    this.docenteService.getAllDocentes().subscribe(
      (data: Docente[]) => {
        this.docentes = data;
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
        this.snackBar.open('Error al cargar Docentes', 'Cerrar', { duration: 5000 });
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

  toggleDetails(docente: Docente) {
    this.dialog.open(DialogoComponent, {
      width: '400px',
      data: docente
    });
  }

  onSelect(docente: Docente) {
    this.selectedDocente = docente;
    this.docenteForm.patchValue(docente);
    this.showForm = true;
    this.cdr.detectChanges();
  }

  onSubmit() {
    if (this.docenteForm.valid) {
      const formValue = { ...this.docenteForm.getRawValue() }; // Use getRawValue to include disabled fields
      if (this.selectedDocente) {
        this.docenteService.update(this.selectedDocente.idDocente, formValue).subscribe(
          () => {
            this.loadDocentes();
            this.resetForm();
            this.snackBar.open('Docente actualizado con éxito', 'Cerrar', { duration: 2000 });
          },
          error => {
            this.snackBar.open(`No se pudo actualizar el Docente: ${error}`, 'Cerrar', { duration: 5000 });
          }
        );
      } else {
        this.docenteService.create(formValue).subscribe(
          () => {
            this.loadDocentes();
            this.resetForm();
            this.snackBar.open('Docente creado con éxito', 'Cerrar', { duration: 2000 });
          },
          error => {
            this.snackBar.open(`No se pudo crear el Docente: ${error}`, 'Cerrar', { duration: 5000 });
          }
        );
      }
    }
  }

  onDelete(docente: Docente) {
    this.docenteService.delete(docente.idDocente).subscribe(
      () => {
        this.loadDocentes();
        this.resetForm();
        this.snackBar.open('Docente eliminado con éxito', 'Cerrar', { duration: 2000 });
      },
      error => {
        this.snackBar.open(`No se pudo eliminar el Docente: ${error}`, 'Cerrar', { duration: 5000 });
      }
    );
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cdr.detectChanges();
  }

  resetForm() {
    this.selectedDocente = null;
    this.docenteForm.reset({
      activo: true,
      fechaRegistro: new Date()
    });
    this.showForm = false;
    this.cdr.detectChanges();
  }

  resetFormFields() {
    this.selectedDocente = null;
    this.docenteForm.reset({
      activo: true,
      fechaRegistro: new Date()
    });
    this.cdr.detectChanges();
  }

  generateCodigo() {
    const latestCode = this.docentes
      .map(d => parseInt(d.codigo, 10))
      .filter(code => !isNaN(code))
      .sort((a, b) => b - a)[0] || 0;
    const newCode = (latestCode + 1).toString().padStart(5, '0'); // e.g., "00004"
    this.docenteForm.get('codigo')?.setValue(newCode);
  }
}