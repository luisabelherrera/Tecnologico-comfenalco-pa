import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Profesor } from 'src/app/models/profesor';
import { ProfesorService } from 'src/app/services/profesor/profesor.service';


@Component({
  selector: 'app-profesor-create',
  templateUrl: './profesor-create.component.html',
  styleUrls: ['./profesor-create.component.scss']
})
export class ProfesorCreateComponent {
  profesor: Profesor = {
    id: 0,
    nombre: '',
    apellido: '',
    especialidad: '',
    telefono: '',
    email: '',
    departamento: { id: 0 }
  };

  constructor(private profesorService: ProfesorService, private router: Router) { }

  saveProfesor(): void {
    this.profesorService.createProfesor(this.profesor).subscribe(() => {
      this.router.navigate(['/profesores']);
    });
  }
}
