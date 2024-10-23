import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Calificacion } from 'src/app/models/entity/Calificacion.interface';
import { Curricular } from 'src/app/models/entity/curricular.model';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { CalificacionService } from 'src/app/services/calificacion/calificacion.service';
import { CurricularService } from 'src/app/services/curricular/curricular.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';

@Component({
  selector: 'app-calificacion-create',
  templateUrl: './calificacion-create.component.html',
  styleUrls: ['./calificacion-create.component.scss']
})
export class CalificacionCreateComponent implements OnInit {
  calificacion: Calificacion = {
    idCalificacion: 0,
    curricular: { idCurricular: 0, descripcion: '', activo: true, fechaRegistro: new Date() },
    estudiante: {
      idEstudiante: 0,
      valorCodigo: '',
      codigo: '',
      nombres: '',
      apellidos: '',
      documentoIdentidad: '',
      fechaNacimiento: new Date(),
      sexo: '',
      ciudad: '',
      direccion: '',
      activo: true
    },
    nota: 0,
    activo: true,
    fechaRegistro: new Date()   
  };

  estudiantes: Estudiante[] = [];
  curriculares: Curricular[] = [];

  constructor(
    private calificacionService: CalificacionService,
    private router: Router,
    private estudianteService: EstudianteService,
    private curricularService: CurricularService
  ) {}

  ngOnInit(): void {
    this.loadEstudiantes();
    this.loadCurriculares();
  }

  loadEstudiantes(): void {
    this.estudianteService.getAllEstudiantes().subscribe(data => {
      this.estudiantes = data;
    });
  }

  loadCurriculares(): void {
    this.curricularService.getCurriculares().subscribe(data => {
      this.curriculares = data;
    }, error => {
      console.error('Error al cargar curriculares', error);
    });
  }

  saveCalificacion(): void { 
    this.calificacion.fechaRegistro = new Date();

    this.calificacionService.createCalificacion(this.calificacion).subscribe(
      () => {
        this.router.navigate(['/calificaciones']);
      },
      (error) => {
        console.error('Error al guardar la calificación:', error.message);
        alert('Error en la operación: ' + (error.error?.message || 'Inténtalo de nuevo más tarde.'));
      }
    );
  }
}
