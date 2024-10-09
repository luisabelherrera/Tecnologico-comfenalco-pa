import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Periodo } from 'src/app/models/entity/Periodo.interface';
import { PeriodoService } from 'src/app/services/periodo/periodo.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-periodo',
  templateUrl: './periodo.component.html',
  styleUrls: ['./periodo.component.scss']
})
export class PeriodoComponent implements OnInit, OnDestroy {
  periodos: Periodo[] = [];
  periodoForm: FormGroup;
  editingId: number | null = null;
  dataSource: MatTableDataSource<Periodo>;
  loading: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  displayedColumns: string[] = ['descripcion', 'fechaInicio', 'fechaFin', 'activo', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private periodoService: PeriodoService, private fb: FormBuilder) {
    // Inicializar el formulario reactivo
    this.periodoForm = this.fb.group({
      descripcion: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.loadPeriodos();
  }

  ngOnDestroy(): void {
    // Completa el observable al destruir el componente para evitar fugas de memoria
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadPeriodos(): void {
    this.loading = true;
    this.periodoService.getAll()
      .pipe(takeUntil(this.destroy$))  // Manejo de suscripciones
      .subscribe({
        next: (data) => {
          this.periodos = data;
          this.dataSource = new MatTableDataSource(this.periodos);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  createPeriodo(): void {
    if (this.editingId !== null) {
      // Si editingId no es nulo, significa que estamos actualizando
      this.updatePeriodo();
    } else if (this.periodoForm.valid) {
      const nuevoPeriodo: Periodo = this.periodoForm.value;
      this.periodoService.create(nuevoPeriodo)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.periodos.push(data);
            this.dataSource.data = this.periodos;
            this.resetPeriodo();
          },
          error: (err) => console.error(err)
        });
    }
  }
  

  editPeriodo(periodo: Periodo): void {
    this.periodoForm.patchValue(periodo);
    this.editingId = periodo.idPeriodo;
  }

  updatePeriodo(): void {
    if (this.editingId !== null && this.periodoForm.valid) {
      const updatedPeriodo: Periodo = { ...this.periodoForm.value, idPeriodo: this.editingId }; // Asegúrate de incluir el idPeriodo
      this.periodoService.update(this.editingId, updatedPeriodo)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            const index = this.periodos.findIndex(p => p.idPeriodo === this.editingId);
            if (index !== -1) {
              this.periodos[index] = data; // Actualiza el período existente en el array
              this.dataSource.data = this.periodos; // Actualiza la fuente de datos de la tabla
            }
            this.resetPeriodo();
          },
          error: (err) => console.error(err)
        });
    }
  }
  
  deletePeriodo(id: number): void {
    this.periodoService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.periodos = this.periodos.filter(p => p.idPeriodo !== id);
          this.dataSource.data = this.periodos;
        },
        error: (err) => console.error(err)
      });
  }

  resetPeriodo(): void {
    this.periodoForm.reset({ activo: true });
    this.editingId = null;
  }
}  