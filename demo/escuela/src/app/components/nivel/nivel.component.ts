import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Nivel } from 'src/app/models/entity/nivel.interface';
import { Periodo } from 'src/app/models/entity/Periodo.interface';
import { NivelService } from 'src/app/services/nivel/Nivel.service';
import { PeriodoService } from 'src/app/services/periodo/periodo.service';

@Component({
  selector: 'app-nivel',
  templateUrl: './nivel.component.html',
  styleUrls: ['./nivel.component.scss']
})
export class NivelComponent implements OnInit {
  nivel: Nivel = this.initializeNivel();
  dataSource = new MatTableDataSource<Nivel>([]);
  periodos: Periodo[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  warningMessage: string | null = null;
  editing: boolean = false;
  showForm: boolean = false;
  displayedColumns: string[] = ['descripcionNivel', 'descripcionTurno', 'periodo', 'horaInicio', 'horaFin', 'activo', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  nivelSuggestions: string[] = [
    'Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto',
    'Sexto', 'Séptimo', 'Octavo', 'Noveno', 'Décimo', 'Undécimo'
  ];
  turnoSuggestions: string[] = ['Mañana', 'Tarde', 'Noche'];

  constructor(
    private nivelService: NivelService,
    private periodoService: PeriodoService
  ) {}

  ngOnInit() {
    this.loadNiveles();
    this.loadPeriodos();
  }

  toggleView(show: boolean): void {
    this.showForm = show;
    this.editing = false;
    if (!show) {
      this.loadNiveles();
      this.resetForm();
    }
  }

  private initializeNivel(): Nivel {
    return {
      idNivel: 0,
      periodo: { idPeriodo: 0, descripcion: '', fechaInicio: new Date(), fechaFin: new Date(), activo: true },
      descripcionNivel: '',
      descripcionTurno: '',
      horaInicio: '',
      horaFin: '',
      activo: true,
    };
  }

  loadNiveles() {
    this.isLoading = true;
    this.nivelService.getAll().subscribe(
      (data: Nivel[]) => {
        console.log('Datos de niveles:', data);
        this.dataSource.data = data.filter(nivel => nivel.periodo?.activo);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error => this.handleError('Error al cargar los niveles', error)
    );
  }

  loadPeriodos() {
    console.log('Cargando períodos...');
    this.periodoService.getAll().subscribe(
      (data: Periodo[]) => {
        console.log('Datos de períodos:', data);
        this.periodos = data || [];
      },
      error => this.handleError('Error al cargar los períodos', error)
    );
  }

  saveNivel() {
    if (this.nivel.periodo && !this.nivel.periodo.activo) {
      this.warningMessage = 'No se puede guardar el nivel. El período seleccionado está inactivo.';
      return;
    }

    if (!this.isNivelValido()) {
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.warningMessage = null;

    const saveObservable = this.editing
      ? this.nivelService.update(this.nivel.idNivel, this.nivel)
      : this.nivelService.create(this.nivel);

    saveObservable.subscribe(
      () => {
        const action = this.editing ? 'actualizado' : 'creado';
        this.successMessage = `Nivel ${action} exitosamente.`;
        this.loadNiveles();
        this.toggleView(false);
      },
      error => this.handleError('Error al guardar el nivel', error)
    );
  }

  deleteNivel(id: number) {
    if (confirm('¿Estás seguro de eliminar este nivel?')) {
      this.isLoading = true;
      this.nivelService.delete(id).subscribe(
        () => {
          this.successMessage = 'Nivel eliminado exitosamente.';
          this.loadNiveles();
        },
        error => this.handleError('Error al eliminar el nivel', error)
      );
    }
  }

  editNivel(nivel: Nivel) {
    this.nivel = { ...nivel };
    this.editing = true;
    this.showForm = true;
  }

  resetForm() {
    this.nivel = this.initializeNivel();
    this.editing = false;
    this.errorMessage = null;
    this.successMessage = null;
    this.warningMessage = null;
  }

  private handleError(message: string, error: any) {
    this.isLoading = false;
    console.error(message, error);
    this.errorMessage = message;
  }

  public isNivelValido(): boolean { // Changed from private to public
    return this.nivel.descripcionNivel && this.nivel.descripcionTurno && this.nivel.periodo.idPeriodo > 0;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}