import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { CursoService } from 'src/app/services/curso/curso.service';
import { ProfesorService } from 'src/app/services/profesor/profesor.service'; // Asegúrate de importar el servicio de profesores
import { AulaService } from 'src/app/services/aula/aula.service'; // Asegúrate de importar el servicio de aulas

@Component({
  selector: 'app-curso-create',
  templateUrl: './curso-create.component.html',
  styleUrls: ['./curso-create.component.scss']
})
export class CursoCreateComponent implements OnInit {
  curso: Curso = {
    id: 0,
    nombre: '',
    descripcion: '',
    horario: '',
    profesor: { id: 0, nombre: '' },
    aula: { id: 0, nombre: '' } 
  };

  profesores = [];
  aulas = [];

  constructor(
    private cursoService: CursoService, 
    private profesorService: ProfesorService,
    private aulaService: AulaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfesores();
    this.loadAulas();
  }

  loadProfesores(): void {
    this.profesorService.getAllProfesores().subscribe(data => {
      this.profesores = data;
    });
  }

  loadAulas(): void {
    this.aulaService.getAulas().subscribe(data => {
      this.aulas = data;
    });
  }

  saveCurso(): void {
    this.cursoService.createCurso(this.curso).subscribe(() => {
      this.router.navigate(['/cursos']);
    });
  }
}
