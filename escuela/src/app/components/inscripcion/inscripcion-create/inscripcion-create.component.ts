import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InscripcionService } from 'src/app/services/inscripcion/inscripcion.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { CursoService } from 'src/app/services/curso/curso.service';
import { Inscripcion } from 'src/app/models/inscripcion.interface';
import { Estudiante } from 'src/app/models/estudiante.model';
import { Curso } from 'src/app/models/curso';


@Component({
  selector: 'app-inscripcion-create',
  templateUrl: './inscripcion-create.component.html',
  styleUrls: ['./inscripcion-create.component.scss']
})
export class InscripcionCreateComponent implements OnInit {
  inscripcion: Inscripcion = {
    id: 0,
    estudiante: { id: 0, nombre: '', apellido: '' },
    curso: { id: 0, nombre: '' },
    fechaInscripcion: '',
    calificacion: 0
  };

  estudiantes: Estudiante[] = [];
  cursos: Curso[] = [];

  constructor(
    private estudianteService: EstudianteService,
    private cursoService: CursoService,
    private inscripcionService: InscripcionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEstudiantes();
    this.loadCursos();
  }

  loadEstudiantes(): void {
    this.estudianteService.getAllEstudiantes().subscribe((estudiantes) => {
      this.estudiantes = estudiantes;
    });
  }

  loadCursos(): void {
    this.cursoService.getAllCursos().subscribe((cursos) => {
      this.cursos = cursos;
    });
  }

  createInscripcion(): void {
    this.inscripcionService.createInscripcion(this.inscripcion).subscribe(() => {
      this.router.navigate(['/inscripciones']);
    });
  }
}