import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';

@Component({
  selector: 'app-editar-estudiante',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarEstudianteComponent implements OnInit {
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
  loading = true;
  errorMessage: string | null = null;

  constructor(
    private estudianteService: EstudianteService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMessage = 'Invalid student ID.';
      this.loading = false;
      return;
    }
    this.estudianteService.getEstudianteById(id).subscribe({
      next: (data) => {
        this.estudiante = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching Estudiante:', err);
        this.loading = false;
        this.errorMessage = 'Error loading Estudiante data.';
      }
    });
  }
  

  actualizarEstudiante(): void {
    if (this.estudiante && this.estudiante.idEstudiante) {
      this.estudianteService.updateEstudiante(this.estudiante.idEstudiante, this.estudiante)
        .subscribe({
          next: () => {
            this.router.navigate(['/listar']);
          },
          error: (err) => {
            console.error('Error updating Estudiante:', err);
            this.errorMessage = 'Error updating Estudiante.';
          }
        });
    } else {
      console.error('Estudiante ID is missing or invalid.');
    }
  }
}
