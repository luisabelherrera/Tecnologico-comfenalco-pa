import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Profesor } from 'src/app/models/profesor';

import { ProfesorService } from 'src/app/services/profesor/profesor.service';

@Component({
  selector: 'app-profesor-detail',
  templateUrl: './profesor-detail.component.html',
  styleUrls: ['./profesor-detail.component.scss']
})
export class ProfesorDetailComponent implements OnInit {
  profesor: Profesor | undefined;

  constructor(private profesorService: ProfesorService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.profesorService.getProfesorById(id).subscribe(profesor => {
      this.profesor = profesor;
    });
  }

  deleteProfesor(): void {
    if (this.profesor) {
      if (confirm('¿Estás seguro de que deseas eliminar este profesor?')) {
        this.profesorService.deleteProfesor(this.profesor.id).subscribe(() => {
          this.router.navigate(['/profesores']);
        });
      }
    }
  }
}
