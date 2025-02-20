import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserDto } from 'src/app/models/models';
import { EstudiantePerfilService } from 'src/app/services/estudiante/ventana-estudiante/estudiante-perfil.service';

@Component({
  selector: 'app-perfil-estudiante',
  templateUrl: './perfil-estudiante.component.html',
  styleUrls: ['./perfil-estudiante.component.scss']
})
export class PerfilEstudianteComponent implements OnInit {

  estudiante?: UserDto;

  constructor(private perfilService: EstudiantePerfilService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.perfilService.getPerfilEstudiante().subscribe(
      (data) => {
        console.log("Datos recibidos:", data);
        this.estudiante = data;
        this.cdRef.detectChanges(); // Forzar actualización en la vista
      },
      (error) => {
        console.error("Error al obtener perfil:", error);
      }
    );
  }
}