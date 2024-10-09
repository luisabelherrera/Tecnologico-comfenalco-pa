import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CursosService } from 'src/app/services/curso/curso.service';
import { Curso } from 'src/app/models/entity/curso.model';

@Component({
  selector: 'app-cursos-edit',
  templateUrl: './cursos-edit.component.html',
  styleUrls: ['./cursos-edit.component.scss']
})
export class CursosEditComponent implements OnInit {
  curso: Curso | undefined;

  constructor(
    private cursosService: CursosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCurso();
  }

  loadCurso(): void {
    const id = Number(this.route.snapshot.paramMap.get('id')); // Get the course ID from the route
    this.cursosService.getCursoById(id).subscribe(
      (data) => {
        this.curso = data;
      },
      (error) => {
        console.error('Error al cargar el curso', error);
      }
    );
  }

  saveCurso(): void {
    if (this.curso) {
      this.cursosService.updateCurso(this.curso.idCurso, this.curso).subscribe(
        () => {
          alert('Curso actualizado con éxito');
          this.router.navigate(['/cursos']); // Redirect to the list of courses
        },
        (error) => {
          console.error('Error al actualizar el curso', error);
        }
      );
    }
  }
}
