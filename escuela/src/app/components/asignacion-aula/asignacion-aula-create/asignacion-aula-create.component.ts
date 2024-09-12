import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsignacionAula } from 'src/app/models/AsignacionAula.interface';
import { AsignacionAulaService } from 'src/app/services/asignacion-aula/asignacion-aula.service';
import { CursoService } from 'src/app/services/curso/curso.service';

import { Curso } from 'src/app/models/curso';
import { Aula } from 'src/app/models/aula';
import { AulaService } from 'src/app/services/aula/aula.service';


@Component({
  selector: 'app-asignacion-aula-create',
  templateUrl: './asignacion-aula-create.component.html',
  styleUrls: ['./asignacion-aula-create.component.scss']
})
export class AsignacionAulaCreateComponent implements OnInit {
  asignacionAula: AsignacionAula = { curso: { id: 0 }, aula: { id: 0 }, diaSemana: '', horaInicio: '', horaFin: '' };
  cursos: Curso[] = [];
  aulas: Aula[] = [];

  constructor(
    private asignacionAulaService: AsignacionAulaService,
    private cursoService: CursoService,
    private aulaService: AulaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCursos();
    this.loadAulas();
  }

  loadCursos(): void {
    this.cursoService.getAllCursos().subscribe((data: Curso[]) => {
      this.cursos = data;
    });
  }

  loadAulas(): void {
    this.aulaService.getAulas().subscribe((data: Aula[]) => {
      this.aulas = data;
    });
  }

  createAsignacionAula(): void {
    this.asignacionAulaService.createAsignacionAula(this.asignacionAula).subscribe(() => {
      this.router.navigate(['/asignaciones-aulas']);
    });
  }
}
