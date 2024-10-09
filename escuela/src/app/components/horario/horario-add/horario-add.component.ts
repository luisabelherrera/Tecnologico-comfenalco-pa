  // src/app/components/horario-add/horario-add.component.ts

  import { Component, OnInit } from '@angular/core';
  import { Router } from '@angular/router';
  import { Horario } from 'src/app/models/entity/horario.model';
  import { HorarioService } from 'src/app/services/horario/Horario.service';
  import { NivelDetalleCurso } from 'src/app/models/entity/NivelDetalleCurso.interface';
  import { NivelDetalleCursoService } from 'src/app/services/niveldetallecurso/nivel-detalle-curso.service';

  @Component({
    selector: 'app-horario-add',
    templateUrl: './horario-add.component.html',
    styleUrls: ['./horario-add.component.scss']
  })
  export class HorarioAddComponent implements OnInit {
    nuevoHorario: Horario = {
      idHorario: 0,
      diaSemana: '',
      horaInicio: '',
      horaFin: '',
      activo: true,
      fechaRegistro: new Date(),
      nivelDetalleCurso: {
          idNivelDetalleCurso: 0,
          nivelDetalle: null,
          curso: { // Inicializa el curso de forma vacía
              idCurso: 0,
              descripcion: '',
              activo: true,
              fechaRegistro: new Date(),
          },
          activo: true,
          fechaRegistro: new Date(),
      },
  };

    nivelesDetalleCurso: NivelDetalleCurso[] = []; // Asegúrate de declarar esta propiedad

    constructor(
      private horarioService: HorarioService,
      private nivelDetalleCursoService: NivelDetalleCursoService, // Servicio para cargar niveles
      private router: Router
    ) {}

    ngOnInit() {
      this.nivelDetalleCursoService.getAll().subscribe(
          (niveles) => {
              this.nivelesDetalleCurso = niveles;
              console.log(this.nivelesDetalleCurso); // Verifica que los niveles contienen la descripción del curso
          },
          (error) => {
              console.error('Error al cargar niveles de detalle de curso:', error);
          }
      );
    }
    
    cancelar() {
      this.router.navigate(['/horario']); 
    }

    agregarHorario() {
      this.horarioService.createHorario(this.nuevoHorario).subscribe(() => {
        this.router.navigate(['/horario']);
      });
    }
  }
