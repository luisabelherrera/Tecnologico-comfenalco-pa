import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';

@Component({
  selector: 'app-crear-estudiante',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})
export class CrearEstudianteComponent {
  estudiante: Estudiante = {
    valorCodigo: '',
    codigo: '',
    nombres: '',
    apellidos: '',
    documentoIdentidad: '',
    fechaNacimiento: new Date(),
    sexo: '',
    ciudad: '',
    direccion: '',
    activo: true,
  };

  constructor(private estudianteService: EstudianteService, private router: Router) { }
  cancelar(){
    this.router.navigate(['/listar']); 

  }
  crearEstudiante(): void {
    this.estudianteService.createEstudiante(this.estudiante).subscribe(() => {
      this.router.navigate(['/listar']); // Redirigir después de crear
    });
  }
}
