import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Inscripcion } from 'src/app/models/inscripcion.interface';
import { InscripcionService } from 'src/app/services/inscripcion/inscripcion.service';

@Component({
  selector: 'app-inscripcion-create',
  templateUrl: './inscripcion-create.component.html',
  styleUrls: ['./inscripcion-create.component.scss']
})
export class InscripcionCreateComponent {

  inscripcion: Inscripcion = {
    id: 0,
    estudiante: { id: 0 } as any,
    curso: { id: 0 } as any,    
    fechaInscripcion: '',
    calificacion: 0
  };

  constructor(private inscripcionService: InscripcionService, private router: Router) { }

  createInscripcion(): void {
    this.inscripcionService.createInscripcion(this.inscripcion).subscribe(() => {
      this.router.navigate(['/inscripciones']);
    });
  }
}
