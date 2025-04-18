import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Periodo } from 'src/app/models/entity/Periodo.interface';
import { PeriodoService } from 'src/app/services/periodo/periodo.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-periodo',
  templateUrl: './periodo.component.html',
  styleUrls: ['./periodo.component.scss']
})
export class PeriodoComponent implements OnInit, OnDestroy {
  periodos: Periodo[] = [];
  periodoForm: FormGroup;
  editingId: number | null = null;
  showForm: boolean = false; // Toggle state
  dataSource: MatTableDataSource<Periodo>;
  loading: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();
  years: number[] = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

  displayedColumns: string[] = ['descripcion', 'fechaInicio', 'fechaFin', 'activo', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private periodoService: PeriodoService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router // Inject Router
  ) {
    this.periodoForm = this.fb.group({
      descripcion: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      activo: [true]
    });
    this.dataSource = new MatTableDataSource(this.periodos);
  }

  ngOnInit(): void {
    this.loadPeriodos();
    this.checkQueryParams();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleView(show: boolean): void {
    this.showForm = show;
    this.editingId = null;
    if (!show) {
      this.loadPeriodos();
      this.periodoForm.reset({ activo: true });
    }
  }

  checkQueryParams() {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const action = params['action'];

      if (action === 'crear') {
        this.showForm = true; // Show the form
      } else if (action === 'consultar') {
        this.showForm = false; // Show the list
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadPeriodos(): void {
    this.loading = true;
    this.periodoService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.periodos = data;
          this.dataSource.data = this.periodos;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error al cargar periodos:', err);
          this.loading = false;
        }
      });
  }

  createPeriodo(): void {
    if (this.editingId !== null) {
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
            console.log('Periodo creado:', data);
          },
          error: (err) => {
            console.error('Error al crear periodo:', err);
          }
        });
    } else {
      console.warn('Formulario inválido al crear:', this.periodoForm.errors);
    }
  }

  editPeriodo(periodo: Periodo): void {
    this.showForm = true; // Show form for editing
    this.periodoForm.patchValue(periodo);
    this.editingId = periodo.idPeriodo;
  }

  updatePeriodo(): void {
    if (this.editingId !== null && this.periodoForm.valid) {
      const updatedPeriodo: Periodo = { ...this.periodoForm.value, idPeriodo: this.editingId };
      this.periodoService.update(this.editingId, updatedPeriodo)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            const index = this.periodos.findIndex(p => p.idPeriodo === this.editingId);
            if (index !== -1) {
              this.periodos[index] = data;
              this.dataSource.data = this.periodos;
            }
            this.resetPeriodo();
            console.log('Periodo actualizado:', data);
          },
          error: (err) => {
            console.error('Error al actualizar periodo:', err);
          }
        });
    }
  }

  deletePeriodo(id: number): void {
    if (confirm('¿Estás seguro de eliminar este período?')) {
      this.periodoService.delete(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.periodos = this.periodos.filter(p => p.idPeriodo !== id);
            this.dataSource.data = this.periodos;
            console.log('Periodo eliminado:', id);
          },
          error: (err) => {
            console.error('Error al eliminar periodo:', err);
          }
        });
    }
  }

  resetPeriodo(): void {
    this.periodoForm.reset({ activo: true });
    this.editingId = null;
    this.showForm = false;
  }
}