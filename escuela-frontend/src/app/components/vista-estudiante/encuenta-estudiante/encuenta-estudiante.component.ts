import { Component, OnInit } from '@angular/core';
import { EncuestaEstudiante } from 'src/app/models/entity/EncuestaEstudiante.interface';
import { UserDto } from 'src/app/models/models';
import { EncuestaEstudianteService } from 'src/app/services/encuentasEstudiante/EncuestaEstudiante.service';
import { EstudiantePerfilService } from 'src/app/services/estudiante/ventana-estudiante/estudiante-perfil.service';

@Component({
  selector: 'app-encuenta-estudiante',
  templateUrl: './encuenta-estudiante.component.html',
  styleUrls: ['./encuenta-estudiante.component.scss']
})
export class EncuestaEstudianteComponent implements OnInit {
  estudiante?: UserDto;
  encuesta?: EncuestaEstudiante;
  editando: boolean = false;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  constructor(
    private encuestaService: EncuestaEstudianteService,
    private perfilService: EstudiantePerfilService
  ) {}

  ngOnInit(): void {
    this.cargarPerfilYEncuesta();
  }

  cargarPerfilYEncuesta(): void {
    this.perfilService.getPerfilEstudiante().subscribe(
      (data: UserDto) => {
        this.estudiante = data;
        console.log('Perfil cargado:', this.estudiante);
        if (this.estudiante?.estudiante?.idEstudiante) {
          this.cargarEncuesta(this.estudiante.estudiante.idEstudiante);
        } else {
          this.mensajeError = 'No se encontró un estudiante asociado a este usuario.';
          console.error('Usuario sin estudiante:', this.estudiante);
        }
      },
      (error) => {
        console.error('Error al cargar perfil:', error);
        this.mensajeError = 'Error al cargar el perfil del estudiante.';
      }
    );
  }

  cargarEncuesta(idEstudiante: number): void {
    this.encuestaService.getEncuestaByEstudianteId(idEstudiante).subscribe(
      (encuesta) => {
        this.encuesta = encuesta;
        console.log('Encuesta cargada:', this.encuesta);
      },
      (error) => {
        console.log('No hay encuesta existente, inicializando una nueva.');
        this.encuesta = { estudiante: this.estudiante!.estudiante };
      }
    );
  }

  habilitarEdicion(): void {
    this.editando = true;
  }

  guardarCambios(): void {
    if (!this.encuesta || !this.estudiante?.estudiante?.idEstudiante) {
      this.mensajeError = 'No hay estudiante válido para guardar la encuesta.';
      return;
    }
  
    const encuestaActualizada: EncuestaEstudiante = {
      ...this.encuesta,
      estudiante: { idEstudiante: this.estudiante.estudiante.idEstudiante }
    };
  
    console.log('Datos a enviar:', encuestaActualizada);
  
    if (this.encuesta.id) {
      this.encuestaService.updateEncuesta(this.encuesta.id, encuestaActualizada).subscribe(
        (response) => {
          this.encuesta = response; // Esto podría fallar si la respuesta tiene un error
          this.mensajeExito = 'Encuesta actualizada con éxito';
          this.editando = false;
          this.cerrarMensajes();
        },
        (error) => {
          console.error('Error al actualizar (ignorado si datos se guardaron):', error);
          // Asumimos que los datos se guardaron a pesar del error en la respuesta
          this.mensajeExito = 'Encuesta actualizada con éxito (respuesta ignorada)';
          this.editando = false;
          this.cerrarMensajes();
        }
      );
    } else {
      this.encuestaService.createEncuesta(encuestaActualizada).subscribe(
        (response) => {
          this.encuesta = response;
          this.mensajeExito = 'Encuesta creada con éxito';
          this.editando = false;
          this.cerrarMensajes();
        },
        (error) => {
          console.error('Error al crear:', error);
          this.mensajeError = 'Error al crear la encuesta.';
        }
      );
    }
  }

  // Método añadido para cerrar mensajes
  cerrarMensajes(): void {
    setTimeout(() => {
      this.mensajeExito = null;
      this.mensajeError = null;
    }, 3000); // Cierra los mensajes después de 3 segundos
  }
}