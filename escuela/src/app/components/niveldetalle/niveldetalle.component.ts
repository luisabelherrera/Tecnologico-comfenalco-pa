import { Component, OnInit } from '@angular/core';
import { NivelDetalle } from 'src/app/models/entity/NivelDetalle.interface';
import { GradoSeccion } from 'src/app/models/entity/GradoSeccion.interface';
import { Nivel } from 'src/app/models/entity/nivel.interface';
import { NivelDetalleService } from 'src/app/services/niveldetalle/NivelDetalle.service';
import { GradoSeccionService } from 'src/app/services/grado-seccion/grado-seccion.service';
import { NivelService } from 'src/app/services/nivel/Nivel.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { NivelDetalleDialogoGraficoComponent } from './nivel-detalle-dialogo-grafico/nivel-detalle-dialogo-grafico.component';

@Component({
    selector: 'app-nivel-detalle',
    templateUrl: './niveldetalle.component.html',
    styleUrls: ['./niveldetalle.component.scss']
})
export class NivelDetalleComponent implements OnInit {
    nivelDetalles: NivelDetalle[] = [];
    nuevoNivelDetalle: NivelDetalle = this.initializeNuevoNivelDetalle();
    gradosSecciones: GradoSeccion[] = [];
    niveles: Nivel[] = [];
    errorMessage: string | null = null;
    successMessage: string | null = null;
    isLoading = false;
    editingNivelDetalle: NivelDetalle | null = null;
    displayedColumns: string[] = [
        'idNivelDetalle',
        'nivel',
        'gradoSeccion',
        'totalVacantes',
        'vacantesDisponibles',
        'vacantesOcupadas',
        'activo',
        'actions'
      ];
      
    dataSource = new MatTableDataSource<NivelDetalle>(this.nivelDetalles);


    constructor(
        private nivelDetalleService: NivelDetalleService,
        private gradoSeccionService: GradoSeccionService,
        private nivelService: NivelService,
        private dialog: MatDialog
   
    ) {}

    ngOnInit(): void {
        this.loadNivelDetalles();
        this.loadGradosSecciones();
        this.loadNiveles();
        
    }

    loadNivelDetalles(): void {
        this.setLoadingState(true);
        this.nivelDetalleService.getAll().subscribe(
            data => {
                this.nivelDetalles = data;
                this.dataSource.data = this.nivelDetalles; 
                this.setLoadingState(false);
            },
            error => this.handleError('Error al cargar los niveles de detalle', error)
        );
    }

    loadGradosSecciones(): void {
        this.setLoadingState(true);
        this.gradoSeccionService.getAllGradoSecciones().subscribe(
            data => {
                console.log('Grados y Secciones:', data); 
                this.gradosSecciones = data;
                this.setLoadingState(false);
            },
            error => this.handleError('Error al cargar los grados y secciones', error)
        );
    }
    
    loadNiveles(): void {
        this.setLoadingState(true);
        this.nivelService.getAll().subscribe(
            data => {
                console.log('Niveles:', data);
                this.niveles = data;
                this.setLoadingState(false);
            },
            error => this.handleError('Error al cargar los niveles', error)
        );
    }
    

    createOrUpdateNivelDetalle(): void {
        if (!this.isValid(this.nuevoNivelDetalle)) {
            this.errorMessage = 'Por favor, complete todos los campos requeridos.';
            return;
        }

        this.setLoadingState(true);
        const action = this.editingNivelDetalle ? this.updateNivelDetalle() : this.createNivelDetalle();
        action.subscribe(
            () => {
                this.successMessage = `Nivel detalle ${this.editingNivelDetalle ? 'actualizado' : 'creado'} con éxito`;
                this.loadNivelDetalles();
                this.resetForm();
            },
            error => this.handleError(`Error al ${this.editingNivelDetalle ? 'actualizar' : 'crear'} nivel detalle`, error)
        );
    }

    createNivelDetalle() {
        return this.nivelDetalleService.create(this.nuevoNivelDetalle);
    }

    updateNivelDetalle() {
        return this.nivelDetalleService.update(this.nuevoNivelDetalle.idNivelDetalle, this.nuevoNivelDetalle);
    }

    setEditingNivelDetalle(nivelDetalle: NivelDetalle): void {
        this.editingNivelDetalle = nivelDetalle;
        this.nuevoNivelDetalle = { ...nivelDetalle };
    }

    deleteNivelDetalle(id: number): void {
        if (confirm('¿Está seguro de que desea eliminar este nivel detalle?')) {
            this.setLoadingState(true);
            this.nivelDetalleService.delete(id).subscribe(
                () => {
                    this.successMessage = 'Nivel detalle eliminado con éxito';
                    this.loadNivelDetalles();
                },
                error => this.handleError('Error al eliminar nivel detalle', error)
            );
        }
    }

    resetForm(): void {
        this.nuevoNivelDetalle = this.initializeNuevoNivelDetalle();
        this.editingNivelDetalle = null;
        this.successMessage = null;
        this.errorMessage = null;
    }

    initializeNuevoNivelDetalle(): NivelDetalle {
        return {
            idNivelDetalle: 0,
            nivel: { 
                idNivel: 0,
                periodo: { 
                    idPeriodo: 0, 
                    descripcion: '', 
                    fechaInicio: new Date(), 
                    fechaFin: new Date(), 
                    activo: true 
                },
                descripcionNivel: '',
                descripcionTurno: '',
                horaInicio: '',
                horaFin: '',
                activo: true 
            },
            gradoSeccion: { 
                idGradoSeccion: 0,
                descripcionGrado: '', 
                descripcionSeccion: '', 
                activo: true 
            },
            totalVacantes: 0,
            vacantesDisponibles: 0,
            vacantesOcupadas: 0,
            activo: true 
        };
    }
    
    setLoadingState(isLoading: boolean): void {
        this.isLoading = isLoading;
    }

    handleError(message: string, error: any): void {
        this.errorMessage = message;
        console.error(error);
        this.setLoadingState(false);
    }

    isValid(nivelDetalle: NivelDetalle): boolean {
        return nivelDetalle.nivel && nivelDetalle.gradoSeccion && nivelDetalle.nivel.descripcionNivel && nivelDetalle.totalVacantes != null;
    }

    openDialogGrafico(nivelDetalle: NivelDetalle): void {
        console.log('Datos del nivel detalle a pasar al gráfico:', nivelDetalle);
        const dialogRef = this.dialog.open(NivelDetalleDialogoGraficoComponent, {
            width: '600px',
            height: '500px',
            data: nivelDetalle  
        });
    
        dialogRef.afterClosed().subscribe(result => {
            
        });
    }
    
      
    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
