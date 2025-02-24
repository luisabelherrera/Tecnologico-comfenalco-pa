import { Component, OnInit } from '@angular/core';
import { UserDto } from 'src/app/models/models';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { EstudiantePerfilService } from 'src/app/services/estudiante/ventana-estudiante/estudiante-perfil.service';

@Component({
  selector: 'app-perfil-estudiante',
  templateUrl: './perfil-estudiante.component.html',
  styleUrls: ['./perfil-estudiante.component.scss']
})
export class PerfilEstudianteComponent implements OnInit {

  estudiante?: UserDto;
  editando: boolean = false;
  copiaEstudiante?: UserDto;
  mensajeExito: string | null = null; // To store the success message

  constructor(
    private perfilService: EstudiantePerfilService,
    private estudianteService: EstudianteService
  ) {}

  ngOnInit(): void {
    this.perfilService.getPerfilEstudiante().subscribe(
      (data) => {
        this.estudiante = data;
      },
      (error) => {
        console.error('Error al obtener perfil:', error);
      }
    );
  }

  habilitarEdicion(): void {
    this.editando = true;
    this.copiaEstudiante = JSON.parse(JSON.stringify(this.estudiante));
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.estudiante = this.copiaEstudiante;
  }

  guardarCambios(): void {
    if (!this.estudiante || !this.estudiante.estudiante) return;

    this.estudianteService.updateEstudiante(this.estudiante.estudiante.idEstudiante, this.estudiante.estudiante)
      .subscribe(
        (response) => {
          console.log('Actualización exitosa:', response);
          this.mensajeExito = 'Perfil del Estudiante Actualizado'; // Set success message
          this.editando = false;
          setTimeout(() => this.cerrarMensaje(), 3000); // Auto-hide after 3 seconds
        },
        (error) => {
          console.error('Error al actualizar estudiante:', error);
        }
      );
  }

  cerrarMensaje(): void {
    this.mensajeExito = null; // Clear the message
  }
}