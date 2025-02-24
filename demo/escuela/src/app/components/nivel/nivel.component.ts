import { Component, OnInit } from '@angular/core';
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
    niveles: Nivel[] = [];
    filteredNiveles: Nivel[] = [];
    paginatedNiveles: Nivel[] = [];
    periodos: Periodo[] = [];
    isLoading: boolean = false;
    errorMessage: string | null = null;
    successMessage: string | null = null;
    warningMessage: string | null = null;
    editing: boolean = false;
    currentPage: number = 1;
    itemsPerPage: number = 5;
    filtro: string = '';

    // Predefined options for selectors
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

    private initializeNivel(): Nivel {
        return {
            idNivel: 0,
            periodo: { idPeriodo: 0, descripcion: '', fechaInicio: new Date(), fechaFin: new Date(), activo: true },
            descripcionNivel: '', // Will be set via selector
            descripcionTurno: '', // Will be set via selector
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
                this.niveles = data.filter(nivel => nivel.periodo?.activo);
                this.filteredNiveles = this.niveles;
                this.updatePaginatedNiveles();
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
                this.resetForm();
            },
            error => this.handleError('Error al guardar el nivel', error)
        );
    }

    deleteNivel(id: number) {
        this.isLoading = true;
        this.nivelService.delete(id).subscribe(
            () => {
                this.successMessage = 'Nivel eliminado exitosamente.';
                this.loadNiveles();
            },
            error => this.handleError('Error al eliminar el nivel', error)
        );
    }

    editNivel(nivel: Nivel) {
        this.nivel = { ...nivel };
        this.editing = true;
    }

    resetForm() {
        this.nivel = this.initializeNivel();
        this.editing = false;
        this.errorMessage = null;
        this.successMessage = null;
    }

    private handleError(message: string, error: any) {
        this.isLoading = false;
        console.error(message, error);
        this.errorMessage = message;
    }

    private isNivelValido(): boolean {
        return this.nivel.descripcionNivel && this.nivel.descripcionTurno && this.nivel.periodo.idPeriodo > 0;
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePaginatedNiveles();
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePaginatedNiveles();
        }
    }

    filterNiveles() {
        this.filteredNiveles = this.niveles.filter(nivel =>
            nivel.descripcionNivel.toLowerCase().includes(this.filtro.toLowerCase())
        );
        this.currentPage = 1;
        this.updatePaginatedNiveles();
    }

    private updatePaginatedNiveles() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        this.paginatedNiveles = this.filteredNiveles.slice(start, start + this.itemsPerPage);
    }

    get totalPages(): number {
        return Math.ceil(this.filteredNiveles.length / this.itemsPerPage);
    }
}