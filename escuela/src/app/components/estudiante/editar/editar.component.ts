import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';

@Component({
  selector: 'app-editar-estudiante',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarEstudianteComponent implements OnInit {
  estudiante: Estudiante | null = null;

  constructor(
    private estudianteService: EstudianteService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.estudianteService.getEstudianteById(id).subscribe(data => {
      this.estudiante = data;
    });
  }

  actualizarEstudiante(): void {
    if (this.estudiante) {
      this.estudianteService.updateEstudiante(this.estudiante.id!, this.estudiante).subscribe(() => {
        this.router.navigate(['/listar']); // Redirigir después de actualizar
      });
    }
  }
}
