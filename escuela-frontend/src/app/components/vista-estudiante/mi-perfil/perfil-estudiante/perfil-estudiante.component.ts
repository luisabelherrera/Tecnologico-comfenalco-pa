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
  mensajeExito: string | null = null;

  constructor(
    private perfilService: EstudiantePerfilService,
    private estudianteService: EstudianteService
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.perfilService.getPerfilEstudiante().subscribe(
      (data) => {
        this.estudiante = data;
        console.log('Perfil cargado:', this.estudiante);
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
    this.estudiante = JSON.parse(JSON.stringify(this.copiaEstudiante));
  }

  guardarCambios(): void {
    if (!this.estudiante || !this.estudiante.estudiante) return;

    const estudianteActualizado = {
      ...this.estudiante.estudiante,
      userId: this.estudiante.id // Incluir userId explícitamente
    };

    this.estudianteService.updateEstudiante(estudianteActualizado.idEstudiante, estudianteActualizado).subscribe(
      (response) => {
        console.log('Actualización exitosa:', response);
        this.estudiante!.estudiante = { ...response };
        this.mensajeExito = 'Perfil del Estudiante Actualizado';
        this.editando = false;
        setTimeout(() => this.cerrarMensaje(), 3000);
      },
      (error) => {
        console.error('Error al actualizar estudiante:', error);
        this.editando = false;
        this.estudiante = JSON.parse(JSON.stringify(this.copiaEstudiante));
      }
    );
  }

  cerrarMensaje(): void {
    this.mensajeExito = null;
  }
}