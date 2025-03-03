import { Component, OnInit } from '@angular/core';
import { UserDto } from 'src/app/models/models';
import { DocentePerfilService } from 'src/app/services/Docente/Docente-perfil/docente-perfil.service';
import { DocenteService } from 'src/app/services/Docente/Docente.service';

@Component({
  selector: 'app-ventana2',
  templateUrl: './ventana2.component.html',
  styleUrls: ['./ventana2.component.scss']
})
export class Ventana2Component implements OnInit {
  docente?: UserDto;
  editando: boolean = false;
  copiaDocente?: UserDto;
  mensajeExito: string | null = null;

  constructor(
    private docentePerfilService: DocentePerfilService,
    private docenteService: DocenteService
  ) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.docentePerfilService.getPerfilDocente().subscribe(
      (data) => {
        this.docente = data;
      },
      (error) => {
        console.error('Error al obtener el perfil del docente:', error);
      }
    );
  }

  habilitarEdicion(): void {
    this.editando = true;
    this.copiaDocente = JSON.parse(JSON.stringify(this.docente));
  }

  cancelarEdicion(): void {
    this.editando = false;
    this.docente = this.copiaDocente;
  }

  guardarCambios(): void {
    if (!this.docente || !this.docente.docente) return;

    this.docenteService.update(this.docente.docente.idDocente, this.docente.docente).subscribe(
      (updatedDocente) => {
        console.log('Actualización exitosa:', updatedDocente);
        this.mensajeExito = 'Perfil del Docente Actualizado';
        this.editando = false;
        this.docente!.docente = updatedDocente;
        setTimeout(() => this.cerrarMensaje(), 3000);
      },
      (error) => {
        console.error('Error al actualizar docente:', error);
      }
    );
  }

  cerrarMensaje(): void {
    this.mensajeExito = null;
  }
}