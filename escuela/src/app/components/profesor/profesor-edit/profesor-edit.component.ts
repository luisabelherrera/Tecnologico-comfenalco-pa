import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Profesor } from 'src/app/models/profesor';
import { ProfesorService } from 'src/app/services/profesor/profesor.service';


@Component({
  selector: 'app-profesor-edit',
  templateUrl: './profesor-edit.component.html',
  styleUrls: ['./profesor-edit.component.scss']
})
export class ProfesorEditComponent implements OnInit {
  profesor: Profesor = {
    id: 0,
    nombre: '',
    apellido: '',
    especialidad: '',
    telefono: '',
    email: '',
    departamento: { id: 0 }
  };

  constructor(private profesorService: ProfesorService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.profesorService.getProfesorById(id).subscribe(data => {
      this.profesor = data;
    });
  }

  updateProfesor(): void {
    this.profesorService.updateProfesor(this.profesor.id, this.profesor).subscribe(() => {
      this.router.navigate(['/profesores']);
    });
  }
}
