import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Calificacion } from 'src/app/models/entity/Calificacion.interface';
import { CalificacionService } from 'src/app/services/calificacion/calificacion.service';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { Curricular } from 'src/app/models/entity/curricular.model';
import { CurricularService } from 'src/app/services/curricular/curricular.service';

@Component({
  selector: 'app-calificacion-edit',
  templateUrl: './calificacion-edit.component.html',
  styleUrls: ['./calificacion-edit.component.scss']
})
export class CalificacionEditComponent implements OnInit {
  calificacion: Calificacion = {
    idCalificacion: 0,
    curricular: { idCurricular: 0, descripcion: '', activo: true, fechaRegistro: new Date() },
    estudiante: { id: 0, valorCodigo: '', codigo: '', nombres: '', apellidos: '', documentoIdentidad: '', fechaNacimiento: new Date(), sexo: '', ciudad: '', direccion: '', activo: true },
    nota: 0,
    activo: true,
    fechaRegistro: new Date()
  };

  estudiantes: Estudiante[] = [];
  curriculares: Curricular[] = []; 
  idCalificacion!: number;
  loading: boolean = false; // To track loading state

  constructor(
    private activatedRoute: ActivatedRoute,
    private calificacionService: CalificacionService,
    private estudianteService: EstudianteService,
    private curricularService: CurricularService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idCalificacion = +this.activatedRoute.snapshot.paramMap.get('id')!;
    this.loadCalificacion();
    this.loadEstudiantes();
    this.loadCurriculares(); 
  }

  loadCalificacion(): void {
    this.loading = true; // Start loading
    this.calificacionService.getCalificacionById(this.idCalificacion).subscribe(
      (data) => {
        this.calificacion = data;
        this.loading = false; // End loading
      },
      (error) => {
        console.error('Error loading calificación', error);
        this.loading = false; // End loading
      }
    );
  }

  loadEstudiantes(): void {
    this.estudianteService.getAllEstudiantes().subscribe(
      (data: Estudiante[]) => {
        this.estudiantes = data;
      },
      (error) => {
        console.error('Error loading estudiantes', error);
      }
    );
  }

  loadCurriculares(): void {
    this.curricularService.getCurriculares().subscribe(
      (data: Curricular[]) => {
        this.curriculares = data;
      },
      (error) => {
        console.error('Error loading curriculares', error);
      }
    );
  }

  saveCalificacion(): void {
    console.log('Formulario enviado:', this.calificacion);
    if (this.calificacion) {
      this.calificacionService.updateCalificacion(this.idCalificacion, this.calificacion).subscribe(
        () => {
          this.router.navigate(['/calificaciones']);
        },
        (error) => {
          console.error('Error updating calificación', error);
        }
      );
    }
  }
}
