
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { CursoService } from 'src/app/services/curso/curso.service';

@Component({
  selector: 'app-curso-edit',
  templateUrl: './curso-edit.component.html',
  styleUrls: ['./curso-edit.component.scss']
})
export class CursoEditComponent implements OnInit {
  curso: Curso = {
    id: 0,
    nombre: '',
    descripcion: '',
    horario: '',
    profesor: { id: 0, nombre: '' }, 
    aula: { id: 0, nombre: '' }
  };

  constructor(private cursoService: CursoService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cursoService.getCursoById(id).subscribe(data => {
      this.curso = data;
    });
  }

  updateCurso(): void {
    this.cursoService.updateCurso(this.curso).subscribe(() => {
      this.router.navigate(['/cursos']);
    });
  }
}
