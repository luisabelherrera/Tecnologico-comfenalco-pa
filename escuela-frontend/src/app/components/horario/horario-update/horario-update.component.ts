import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Horario } from 'src/app/models/entity/horario.model';
import { HorarioService } from 'src/app/services/horario/Horario.service';

@Component({
  selector: 'app-horario-update',
  templateUrl: './horario-update.component.html',
  styleUrls: ['./horario-update.component.scss']
})
export class HorarioUpdateComponent implements OnInit {
  horario: Horario = {
    idHorario: 0,
    diaSemana: '',
    horaInicio: '',
    horaFin: '',
    activo: true,
    fechaRegistro: new Date(),
    nivelDetalleCurso: {
      idNivelDetalleCurso: 0,
      nivelDetalle: null,
      curso: {  
        idCurso: 0,
        descripcion: '',
        activo: true,
        fechaRegistro: new Date(),
      },
      activo: true,
      fechaRegistro: new Date(),
    },
  };

  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // Inicializar nivelesDetalleCurso
  nivelesDetalleCurso: any[] = []; // Cambia `any[]` al tipo específico si existe

  constructor(
    private horarioService: HorarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.horarioService.getAllHorarios().subscribe(horarios => {
      const horarioEncontrado = horarios.find(h => h.idHorario === id);
      if (horarioEncontrado) {
        this.horario = horarioEncontrado;
      }
    });

    // Llama a la función para cargar nivelesDetalleCurso
    this.cargarNivelesDetalleCurso();
  }

  // Cargar nivelesDetalleCurso (simulado o desde un servicio real)
  cargarNivelesDetalleCurso() {
    // Si tienes un servicio para obtener nivelesDetalleCurso, descomenta la línea de abajo y coméntala después de probar
    // this.horarioService.getNivelesDetalleCurso().subscribe(data => this.nivelesDetalleCurso = data);

    // Datos de ejemplo para la lista (reemplázalos con tu lógica de carga real)
    this.nivelesDetalleCurso = [
      { curso: { descripcion: 'Matemáticas' }, nivelDetalle: { gradoSeccion: { descripcionGrado: 'Grado 1' } } },
      { curso: { descripcion: 'Ciencias' }, nivelDetalle: { gradoSeccion: { descripcionGrado: 'Grado 2' } } },
    ];
  }

  cancelar() {
    this.router.navigate(['/horario']);
  }

  actualizarHorario() {
    if (this.horario) {
      this.horarioService.updateHorario(this.horario.idHorario, this.horario).subscribe(() => {
        this.router.navigate(['/horario']);
      });
    }
  }
}
