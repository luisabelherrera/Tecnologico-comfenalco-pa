
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsignacionAula } from 'src/app/models/AsignacionAula.interface';
import { Aula } from 'src/app/models/aula';
import { Curso } from 'src/app/models/curso';
import { AsignacionAulaService } from 'src/app/services/asignacion-aula/asignacion-aula.service';
import { AulaService } from 'src/app/services/aula/aula.service';

import { CursoService } from 'src/app/services/curso/curso.service';

@Component({
  selector: 'app-asignacion-aula-detail',
  templateUrl: './asignacion-aula-detail.component.html',
  styleUrls: ['./asignacion-aula-detail.component.scss']
})
export class AsignacionAulaDetailComponent implements OnInit {
  asignacionAula: AsignacionAula | undefined;
  cursos: Curso[] = [];
  aulas: Aula[] = [];

  constructor(
    private asignacionAulaService: AsignacionAulaService,
    private cursoService: CursoService,
    private aulaService: AulaService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.asignacionAulaService.getAsignacionAulaById(+id).subscribe(data => {
        this.asignacionAula = data;
        this.loadCursos();
        this.loadAulas();
      });
    }
  }

  loadCursos(): void {
    this.cursoService.getAllCursos().subscribe((data: Curso[]) => {
      this.cursos = data;
      if (this.asignacionAula) {
        this.asignacionAula.curso = this.cursos.find(c => c.id === this.asignacionAula.curso.id) || { id: 0, nombre: '' };
      }
    });
  }

  loadAulas(): void {
    this.aulaService.getAulas().subscribe((data: Aula[]) => {
      this.aulas = data;
      if (this.asignacionAula) {
        this.asignacionAula.aula = this.aulas.find(a => a.id === this.asignacionAula.aula.id) || { id: 0, nombre: '' };
      }
    });
  }
}