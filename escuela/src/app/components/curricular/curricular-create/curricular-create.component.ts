import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Curricular } from 'src/app/models/entity/curricular.model';
import { CurricularService } from 'src/app/services/curricular/curricular.service';
import { NgForm } from '@angular/forms';
import { Docente } from 'src/app/models/entity/docente.model'; 
import { DocenteNivelDetalleCurso } from 'src/app/models/entity/docente-nivel-detalle-curso.model'; 
import { DocenteNivelDetalleCursoService } from 'src/app/services/docente-detalle/docente-nivel-detalle-curso.service';

@Component({
    selector: 'app-curricular-create',
    templateUrl: './curricular-create.component.html',
    styleUrls: ['./curricular-create.component.scss']
})
export class CurricularCreateComponent implements OnInit {
    curricular: Curricular = { 
        descripcion: '', 
        docenteNivelDetalleCurso: {} as DocenteNivelDetalleCurso, 
        activo: true, 
        fechaRegistro: new Date() 
    };
    docentes: DocenteNivelDetalleCurso[] = [];  
    isLoading: boolean = false;
    errorMessage: string | null = null;
    successMessage: string | null = null;

    @ViewChild('curricularForm') curricularForm!: NgForm;

    constructor(
        private curricularService: CurricularService,
        private docenteService: DocenteNivelDetalleCursoService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadDocentes(); 
    }

    loadDocentes(): void {
        this.docenteService.getAll().subscribe(
            (data: DocenteNivelDetalleCurso[]) => { 
                this.docentes = data; 
            },
            (error) => {
                console.error('Error al cargar docentes', error);
                this.errorMessage = 'Error al cargar docentes';
            }
        );
    }
    cancelar(): void {
        this.router.navigate(['/curriculares']);  
      }
    saveCurricular(): void {
        this.isLoading = true;
        this.errorMessage = null;
        this.successMessage = null;

        this.curricularService.createCurricular(this.curricular).subscribe(
            () => {
                this.isLoading = false;
                this.successMessage = '¡Curricular creado exitosamente!';
                this.curricularForm.resetForm();

                setTimeout(() => {
                    this.router.navigate(['/curriculares']);
                }, 2000);
            },
            (error) => {
                this.isLoading = false;
                this.errorMessage = 'Error al crear el curricular: ' + (error.error?.message || error.message);
                console.error('Error al crear curricular', error);
            }
        );
    }
}
