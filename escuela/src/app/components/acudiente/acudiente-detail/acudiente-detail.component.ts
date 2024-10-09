import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AcudienteService } from 'src/app/services/acudiente/acudiente.service';
import { Acudiente } from 'src/app/models/entity/Acudiente.interface';

@Component({
  selector: 'app-acudiente-detail',
  templateUrl: './acudiente-detail.component.html',
  styleUrls: ['./acudiente-detail.component.scss']
})
export class AcudienteDetailComponent implements OnInit {
  acudiente: Acudiente | null = null;  // Inicializa como nulo hasta que se cargue
  acudienteForm: FormGroup;  // Definición del FormGroup

  constructor(
    private acudienteService: AcudienteService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder // Inyección del FormBuilder
  ) {
    // Inicialización del formulario
    this.acudienteForm = this.formBuilder.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      documentoIdentidad: ['', Validators.required],
      ciudad: ['', Validators.required],
      direccion: ['', Validators.required],
      estadoCivil: ['', Validators.required],
      sexo: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      activo: [true],  // Por defecto, activo es verdadero
      parentesco: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAcudienteDetails();
  }

  loadAcudienteDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');  // Obtener el ID de la URL
    if (id) {
      this.acudienteService.getAcudienteById(Number(id)).subscribe(
        (data: Acudiente) => {
          this.acudiente = data;  // Asignar los datos del acudiente
          // Asignar los datos al formulario
          this.acudienteForm.patchValue(data);
        },
        (error) => {
          console.error('Error al cargar los detalles del acudiente', error);
        }
      );
    }
  }

  onSubmit(): void {
    if (this.acudienteForm.valid) {
      // Aquí puedes manejar el envío del formulario
      console.log('Formulario enviado:', this.acudienteForm.value);
      // Lógica para guardar el acudiente puede ir aquí
    }
  }
}
