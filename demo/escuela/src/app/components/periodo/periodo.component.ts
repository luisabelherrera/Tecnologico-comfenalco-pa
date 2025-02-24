import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Periodo } from 'src/app/models/entity/Periodo.interface';
import { PeriodoService } from 'src/app/services/periodo/periodo.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router'; // Para recibir query params

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
  years: number[] = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i); // Últimos 50 años

  displayedColumns: string[] = ['descripcion', 'fechaInicio', 'fechaFin', 'activo', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private periodoService: PeriodoService,
    private fb: FormBuilder,
    private route: ActivatedRoute // Inyectamos ActivatedRoute
  ) {
    this.periodoForm = this.fb.group({
      descripcion: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.loadPeriodos();
    this.checkQueryParams(); // Verificamos query params al iniciar
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Verificar y prellenar el formulario con datos de query params
  checkQueryParams() {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['descripcion']) {
        const periodoData = {
          descripcion: params['descripcion'],
          fechaInicio: new Date(params['fechaInicio']),
          fechaFin: new Date(params['fechaFin']),
          activo: params['activo'] === 'true'
        };

        // Verificamos que las fechas sean válidas
        if (isNaN(periodoData.fechaInicio.getTime()) || isNaN(periodoData.fechaFin.getTime())) {
          console.error('Fechas inválidas en query params');
          return;
        }

        this.periodoForm.patchValue(periodoData);
        this.simulateCreation(); // Simulamos la creación
      }
    });
  }

  // Simular la creación automática del periodo
  simulateCreation() {
    if (this.periodoForm.valid) {
      console.log('Simulando creación con:', this.periodoForm.value);
      setTimeout(() => {
        this.createPeriodo(); // Creamos el periodo después de 2 segundos
      }, 2000);
    } else {
      console.warn('Formulario inválido al simular creación:', this.periodoForm.errors);
    }
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
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.periodos = data;
          this.dataSource = new MatTableDataSource(this.periodos);
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

  resetPeriodo(): void {
    this.periodoForm.reset({ activo: true });
    this.editingId = null;
  }
}