import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InscripcionService } from 'src/app/services/inscripcion/inscripcion.service';
import { Inscripcion } from 'src/app/models/inscripcion.interface';

@Component({
  selector: 'app-inscripcion-edit',
  templateUrl: './inscripcion-edit.component.html',
  styleUrls: ['./inscripcion-edit.component.scss']
})
export class InscripcionEditComponent implements OnInit {
  inscripcion: Inscripcion = {
    id: 0,
    estudiante: { id: 0, nombre: '', apellido: '' },
    curso: { id: 0, nombre: '' },
    fechaInscripcion: '',
    calificacion: 0
  };


  constructor(
    private inscripcionService: InscripcionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.inscripcionService.getInscripcionById(+id).subscribe(data => {
        this.inscripcion = {
          ...data,
          fechaInscripcion: data.fechaInscripcion
        };
      });
    }
  }

  updateInscripcion(): void {
    const updatedInscripcion: Inscripcion = {
      ...this.inscripcion,
      fechaInscripcion: this.inscripcion.fechaInscripcion 
    };
  
    this.inscripcionService.updateInscripcion(this.inscripcion.id, updatedInscripcion).subscribe(() => {
      this.router.navigate(['/inscripciones']);
    });
  }
}
