import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NivelDetalleCursoService } from 'src/app/services/niveldetallecurso/nivel-detalle-curso.service';
import { NivelDetalle } from 'src/app/models/entity/NivelDetalle.interface';
import { Curso } from 'src/app/models/entity/curso.model';
import { NivelDetalleService } from 'src/app/services/niveldetalle/NivelDetalle.service';
import { CursosService } from 'src/app/services/curso/curso.service';
import { NivelDetalleCurso } from 'src/app/models/entity/NivelDetalleCurso.interface';

@Component({
    selector: 'app-nivel-detalle-curso',
    templateUrl: './niveldetallecurso.component.html',
    styleUrls: ['./niveldetallecurso.component.scss']
})
export class NivelDetalleCursoComponent implements OnInit {
    nivelDetalleCursos: NivelDetalleCurso[] = [];
    selectedCurso: NivelDetalleCurso = this.createEmptyNivelDetalleCurso(); 
    isEditing = false;  
    nivelesDetalles: NivelDetalle[] = []; 
    cursos: Curso[] = [];  

    constructor(
        private nivelDetalleCursoService: NivelDetalleCursoService, 
        private nivelDetalleService: NivelDetalleService,
        private cursoService: CursosService, 
        private router: Router
    ) {}

    ngOnInit(): void {
        this.fetchNivelDetalleCursos(); 
        this.fetchNivelesDetalles();  
        this.fetchCursos();  
    }

    fetchNivelDetalleCursos(): void {
        this.nivelDetalleCursoService.getAll().subscribe({
            next: (data) => this.nivelDetalleCursos = data,
            error: (err) => console.error(err)
        });
    }

    fetchNivelesDetalles(): void {
        this.nivelDetalleService.getAll().subscribe({
            next: (data) => this.nivelesDetalles = data,
            error: (err) => console.error(err)
        });
    }

    fetchCursos(): void {
        this.cursoService.getCursos().subscribe({
            next: (data) => this.cursos = data,
            error: (err) => console.error(err)
        });
    }

    createOrUpdate(): void {
        const request = this.isEditing
            ? this.nivelDetalleCursoService.update(this.selectedCurso.idNivelDetalleCurso, this.selectedCurso)
            : this.nivelDetalleCursoService.create(this.selectedCurso);

        request.subscribe({
            next: () => {
                this.fetchNivelDetalleCursos();
                this.resetForm();
            },
            error: (err) => console.error(err)
        });
    }

    editCurso(curso: NivelDetalleCurso): void {
        this.selectedCurso = { ...curso };  
        this.isEditing = true;  
    }

    deleteCurso(id: number): void {
        if (confirm('quiere eliminarlo?')) {
            this.nivelDetalleCursoService.delete(id).subscribe({
                next: () => this.fetchNivelDetalleCursos(),
                error: (err) => console.error(err)
            });
        }
    }

    resetForm(): void {
        this.selectedCurso = this.createEmptyNivelDetalleCurso();
        this.isEditing = false;
    }

    private createEmptyNivelDetalleCurso(): NivelDetalleCurso {
        return {
            idNivelDetalleCurso: 0,
            nivelDetalle: {
                idNivelDetalle: 0,
                nivel: {
                    idNivel: 0,
                    periodo: {
                        idPeriodo: 1,
                        descripcion: 'Primer Semestre',
                        fechaInicio: new Date('2024-01-01'),
                        fechaFin: new Date('2024-06-30'),
                        activo: true,
                    },
                    descripcionNivel: 'Nivel 1',
                    descripcionTurno: 'Mañana',
                    horaInicio: '08:00',
                    horaFin: '12:00',
                    activo: true,
                },
                gradoSeccion: {
                    idGradoSeccion: 0,
                    descripcionGrado: 'Grado 1',
                    descripcionSeccion: 'Sección A',
                    activo: true,
                },
                totalVacantes: 0,
                vacantesDisponibles: 0,
                vacantesOcupadas: 0,
                activo: true,
            },
            curso: {
                idCurso: 0,
                descripcion: '',
                activo: true,
                fechaRegistro: new Date(),
            },
            activo: true,
            fechaRegistro: new Date(),
        };
    }
}
