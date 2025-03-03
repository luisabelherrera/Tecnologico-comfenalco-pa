import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Acudiente } from 'src/app/models/entity/Acudiente.interface';
import { AcudienteService } from 'src/app/services/acudiente/acudiente.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-acudiente-list',
  templateUrl: './acudiente-list.component.html',
  styleUrls: ['./acudiente-list.component.scss']
})
export class AcudienteListComponent implements OnInit, AfterViewInit {
  // Form properties
  acudienteForm: FormGroup;
  showForm: boolean = false;
  isEditMode: boolean = false;

  // List properties
  acudientes: Acudiente[] = [];
  dataSource = new MatTableDataSource<Acudiente>([]);
  displayedColumns: string[] = ['nombres', 'apellidos', 'documentoIdentidad', 'ciudad', 'activo', 'actions'];
  filterValue: string = '';
  filterType: string = 'nombre';
  totalElements: number = 0;
  totalPages: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private acudienteService: AcudienteService,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.acudienteForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      documentoIdentidad: ['', Validators.required],
      ciudad: ['', Validators.required],
      direccion: [''],
      estadoCivil: ['', Validators.required],
      sexo: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      activo: [true],
      parentesco: ['']
    });
  }

  ngOnInit(): void {
    this.loadAcudientes(0, this.pageSize);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  toggleView(show: boolean): void {
    this.showForm = show;
    this.isEditMode = false;
    if (!show) {
      this.loadAcudientes(this.pageIndex, this.pageSize);
      this.acudienteForm.reset({ activo: true });
    }
  }

  loadAcudientes(page: number, size: number): void {
    const filter = this.filterType === 'nombre' ? this.filterValue : '';
    const documento = this.filterType === 'documento' ? this.filterValue : '';
    this.acudienteService.getAcudientes(page, size, filter, documento).subscribe(
      (data) => {
        this.acudientes = data.content;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.dataSource.data = this.acudientes;
        if (this.paginator) {
          this.paginator.pageIndex = page;
          this.paginator.pageSize = size;
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

  saveAcudiente(): void {
    if (this.acudienteForm.invalid) {
      this.acudienteForm.markAllAsTouched();
      return;
    }

    const acudiente: Acudiente = this.acudienteForm.value;
    this.acudienteService.createAcudiente(acudiente).subscribe(
      () => {
        this.snackBar.open('Acudiente creado correctamente', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
        this.toggleView(false);
      },
      (error) => {
        console.error('Error al crear el acudiente:', error);
        this.snackBar.open('Error al crear el acudiente', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    );
  }

  deleteAcudiente(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este acudiente?')) {
      this.acudienteService.deleteAcudiente(id).subscribe(
        () => {
          this.loadAcudientes(this.pageIndex, this.pageSize);
          this.snackBar.open('Acudiente eliminado correctamente', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['success-snackbar']
          });
        },
        (error) => {
          console.error('Error al eliminar el acudiente', error);
          this.snackBar.open('Error al eliminar el acudiente', 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      );
    }
  }

  metodoabsorver(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAcudientes(this.pageIndex, this.pageSize);
  }

  applyFilter(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.pageIndex = 0;
    this.loadAcudientes(this.pageIndex, this.pageSize);
  }

  onFilterTypeChange(event: MatSelectChange): void {
    this.filterType = event.value;
    this.pageIndex = 0;
    this.loadAcudientes(this.pageIndex, this.pageSize);
  }

  resetForm(): void {
    this.acudienteForm.reset({ activo: true });
    this.toggleView(false);
  }
}