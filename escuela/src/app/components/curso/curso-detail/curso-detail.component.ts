
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Curso } from 'src/app/models/curso';
import { CursoService } from 'src/app/services/curso/curso.service';


@Component({
  selector: 'app-curso-detail',
  templateUrl: './curso-detail.component.html',
  styleUrls: ['./curso-detail.component.scss']
})
export class CursoDetailComponent implements OnInit {
  curso: Curso;

  constructor(
    private route: ActivatedRoute,
    private cursoService: CursoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cursoService.getCursoById(+id).subscribe(
        (curso: Curso) => {
          this.curso = curso;
        }
      );
    }
  }
}
