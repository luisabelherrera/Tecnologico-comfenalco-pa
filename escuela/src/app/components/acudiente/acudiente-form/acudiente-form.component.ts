import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Acudiente } from 'src/app/models/entity/Acudiente.interface';
import { AcudienteService } from 'src/app/services/acudiente/acudiente.service';

@Component({
  selector: 'app-acudiente-form',
  templateUrl: './acudiente-form.component.html',
  styleUrls: ['./acudiente-form.component.scss']
})
export class AcudienteFormComponent implements OnInit {
  acudiente: Acudiente = {
    idAcudiente: undefined,
    nombres: '',
    apellidos: '',
    documentoIdentidad: '',
    ciudad: '',
    direccion: '',
    estadoCivil: '',
    sexo: '',
    fechaNacimiento: new Date(),
    activo: true,  
    parentesco: '' 
  };
  

  isEditMode: boolean = false;

  constructor(
    private acudienteService: AcudienteService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.getAcudienteById(id);
    }
  }

  getAcudienteById(id: string): void {
    this.acudienteService.getAcudienteById(+id).subscribe((data: Acudiente) => {
      this.acudiente = data;
    }, (error) => {
      console.error('Error al obtener el acudiente:', error);
      // Puedes redirigir o mostrar un mensaje de error
    });
  }

  saveAcudiente(): void {
    if (this.isEditMode) {
      this.acudienteService.updateAcudiente(this.acudiente.idAcudiente!, this.acudiente).subscribe(() => {
        this.router.navigate(['/acudientes']);
      }, (error) => {
        console.error('Error al actualizar el acudiente:', error);
        // Manejo de errores: muestra un mensaje al usuario
      });
    } else {
      this.acudienteService.createAcudiente(this.acudiente).subscribe(() => {
        this.router.navigate(['/acudientes']);
      }, (error) => {
        console.error('Error al crear el acudiente:', error);
        // Manejo de errores: muestra un mensaje al usuario
      });
    }
  }
}
