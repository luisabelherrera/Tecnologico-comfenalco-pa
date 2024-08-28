import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Curso } from 'src/app/models/curso';
import { CursoService } from 'src/app/services/curso/curso.service';

@Component({
  selector: 'app-curso-create',
  templateUrl: './curso-create.component.html',
  styleUrls: ['./curso-create.component.scss']
})
export class CursoCreateComponent {
  curso: Curso = {
    id: 0,
    nombre: '',
    descripcion: '',
    horario: '',
    profesor: { id: 0, nombre: '' },
    aula: { id: 0, nombre: '' } 
  };

  constructor(private cursoService: CursoService, private router: Router) { }

  saveCurso(): void {
    this.cursoService.createCurso(this.curso).subscribe(() => {
      this.router.navigate(['/cursos']);
    });
  }
}
