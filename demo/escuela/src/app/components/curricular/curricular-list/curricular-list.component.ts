import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import { Curricular } from 'src/app/models/entity/curricular.model';
import { CurricularService } from 'src/app/services/curricular/curricular.service';
import { DocenteNivelDetalleCurso } from 'src/app/models/entity/docente-nivel-detalle-curso.model';
import { DocenteNivelDetalleCursoService } from 'src/app/services/docente-detalle/docente-nivel-detalle-curso.service';

@Component({
  selector: 'app-curricular',
  templateUrl: './curricular-list.component.html',
  styleUrls: ['./curricular-list.component.scss']
})
export class CurricularListComponent implements OnInit, AfterViewInit {
  curriculares: Curricular[] = [];
  dataSource = new MatTableDataSource<Curricular>([]);
  selectedCurricular: Curricular | null = null;
  curricularForm: FormGroup;
  showForm = false;
  pageSize: number = 5;
  pageIndex: number = 0;
  filterValue: string = '';
  displayedColumns: string[] = ['descripcion', 'activo', 'fechaRegistro', 'docente', 'acciones'];
  docentes: DocenteNivelDetalleCurso[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private curricularService: CurricularService,
    private docenteService: DocenteNivelDetalleCursoService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.curricularForm = this.fb.group({
      id: [null],
      descripcion: ['', Validators.required],
      docenteNivelDetalleCurso: [null, Validators.required],
      activo: [true],
      fechaRegistro: [new Date()]
    });
  }

  ngOnInit(): void {
    this.loadCurriculares();
    this.loadDocentes();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.cdr.detectChanges();
  }

  toggleView(show: boolean): void {
    this.showForm = show;
    if (show) {
      this.resetFormFields();
    }
    this.cdr.detectChanges();
  }

  loadCurriculares(): void {
    this.curricularService.getCurriculares().subscribe(
      (data: Curricular[]) => {
        this.curriculares = data;
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
        this.snackBar.open('Error al cargar curriculares', 'Cerrar', { duration: 5000 });
        this.dataSource.data = [];
        this.cdr.detectChanges();
      }
    );
  }

  loadDocentes(): void {
    this.docenteService.getAll().subscribe(
      (data: DocenteNivelDetalleCurso[]) => {
        this.docentes = data;
      },
      error => {
        this.snackBar.open('Error al cargar docentes', 'Cerrar', { duration: 5000 });
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

  onSelect(curricular: Curricular): void {
    this.selectedCurricular = curricular;
    this.curricularForm.patchValue(curricular);
    this.showForm = true;
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    if (this.curricularForm.valid) {
      const formValue = this.curricularForm.value;
      if (this.selectedCurricular && this.selectedCurricular.idCurricular) {
        this.curricularService.updateCurricular(this.selectedCurricular.idCurricular, formValue).subscribe(
          () => {
            this.loadCurriculares();
            this.resetForm();
            this.snackBar.open('Curricular actualizado con éxito', 'Cerrar', { duration: 2000 });
          },
          error => {
            this.snackBar.open(`No se pudo actualizar el curricular: ${error}`, 'Cerrar', { duration: 5000 });
          }
        );
      } else {
        this.curricularService.createCurricular(formValue).subscribe(
          () => {
            this.loadCurriculares();
            this.resetForm();
            this.snackBar.open('Curricular creado con éxito', 'Cerrar', { duration: 2000 });
          },
          error => {
            this.snackBar.open(`No se pudo crear el curricular: ${error}`, 'Cerrar', { duration: 5000 });
          }
        );
      }
    }
  }

  onDelete(curricular: Curricular): void {
    if (confirm('¿Estás seguro de que quieres eliminar este curricular?')) {
      this.curricularService.deleteCurricular(curricular.idCurricular!).subscribe(
        () => {
          this.loadCurriculares();
          this.resetForm();
          this.snackBar.open('Curricular eliminado con éxito', 'Cerrar', { duration: 2000 });
        },
        error => {
          this.snackBar.open(`No se pudo eliminar el curricular: ${error}`, 'Cerrar', { duration: 5000 });
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
    this.selectedCurricular = null;
    this.curricularForm.reset({
      activo: true,
      fechaRegistro: new Date()
    });
    this.showForm = false;
    this.cdr.detectChanges();
  }

  resetFormFields(): void {
    this.selectedCurricular = null;
    this.curricularForm.reset({
      activo: true,
      fechaRegistro: new Date()
    });
    this.cdr.detectChanges();
  }
}