import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EncuestaEstudiante } from 'src/app/models/entity/EncuestaEstudiante.interface';
import { UserDto } from 'src/app/models/models';
import { EncuestaEstudianteService } from 'src/app/services/encuentasEstudiante/EncuestaEstudiante.service';
import { EstudiantePerfilService } from 'src/app/services/estudiante/ventana-estudiante/estudiante-perfil.service';

@Component({
  selector: 'app-encuesta-estudiante',
  templateUrl: './encuesta-estudiante.component.html',
  styleUrls: ['./encuesta-estudiante.component.scss']
})
export class EncuestaEstudianteComponent implements OnInit {
  estudiante?: UserDto;
  encuesta?: EncuestaEstudiante;
  surveyForm: FormGroup;
  editando: boolean = false;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private encuestaService: EncuestaEstudianteService,
    private perfilService: EstudiantePerfilService
  ) {
    this.surveyForm = this.fb.group({
      problemasPersonales: ['', Validators.required],
      confianza: ['', Validators.required],
      estadoEmocional: ['', Validators.required],
      apoyoFamiliar: ['', Validators.required],
      nivelEstres: ['', Validators.required],
      recibeAyudaPsicologica: ['', Validators.required],
      horasEstudioSemanal: ['', Validators.required],
      asistencia: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      participacionClases: ['', Validators.required],
      usoPlataformaVirtual: ['', Validators.required],
      antecedentesPerdida: ['', Validators.required],
      cargaAcademica: ['', Validators.required],
      estrato: ['', Validators.required],
      recibeSubsidio: ['', Validators.required],
      tieneAccesoInternet: ['', Validators.required],
      tieneComputador: ['', Validators.required],
      viveConPadres: ['', Validators.required],
      tieneTrabajo: ['', Validators.required],
      ingresosFamiliares: ['', [Validators.min(0)]],
      poseeReciboLuz: ['', Validators.required],
      poseeReciboAgua: ['', Validators.required],
      poseeReciboGas: ['', Validators.required],
      tieneSisben: ['', Validators.required],
      tieneSeguroMedico: ['', Validators.required]
    });
  }

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
        if (encuesta) {
          this.populateForm(encuesta);
        }
      },
      (error) => {
        console.log('No hay encuesta existente, inicializando una nueva.');
        this.encuesta = { estudiante: this.estudiante!.estudiante };
      }
    );
  }

  populateForm(encuesta: EncuestaEstudiante): void {
    this.surveyForm.patchValue({
      problemasPersonales: encuesta.problemasPersonales || '',
      confianza: encuesta.confianza || '',
      estadoEmocional: encuesta.estadoEmocional || '',
      apoyoFamiliar: encuesta.apoyoFamiliar || '',
      nivelEstres: encuesta.nivelEstres || '',
      recibeAyudaPsicologica: encuesta.recibeAyudaPsicologica ?? null,
      horasEstudioSemanal: encuesta.horasEstudioSemanal || '',
      asistencia: encuesta.asistencia || '',
      participacionClases: encuesta.participacionClases || '',
      usoPlataformaVirtual: encuesta.usoPlataformaVirtual || '',
      antecedentesPerdida: encuesta.antecedentesPerdida || '',
      cargaAcademica: encuesta.cargaAcademica || '',
      estrato: encuesta.estrato || '',
      recibeSubsidio: encuesta.recibeSubsidio ?? null,
      tieneAccesoInternet: encuesta.tieneAccesoInternet ?? null,
      tieneComputador: encuesta.tieneComputador ?? null,
      viveConPadres: encuesta.viveConPadres ?? null,
      tieneTrabajo: encuesta.tieneTrabajo ?? null,
      ingresosFamiliares: encuesta.ingresosFamiliares ?? null,
      poseeReciboLuz: encuesta.poseeReciboLuz ?? null,
      poseeReciboAgua: encuesta.poseeReciboAgua ?? null,
      poseeReciboGas: encuesta.poseeReciboGas ?? null,
      tieneSisben: encuesta.tieneSisben ?? null,
      tieneSeguroMedico: encuesta.tieneSeguroMedico ?? null
    });
  }

  habilitarEdicion(): void {
    if (this.encuesta && this.encuesta.id) {
      this.populateForm(this.encuesta);
    } else {
      this.surveyForm.reset();
    }
    this.editando = true;
  }

  guardarCambios(): void {
    if (this.surveyForm.invalid || !this.estudiante?.estudiante?.idEstudiante) {
      this.surveyForm.markAllAsTouched();
      this.mensajeError = 'Por favor, complete todos los campos requeridos.';
      return;
    }

    const encuestaActualizada: EncuestaEstudiante = {
      ...this.surveyForm.value,
      estudiante: { idEstudiante: this.estudiante.estudiante.idEstudiante },
      id: this.encuesta?.id
    };

    console.log('Datos a enviar:', encuestaActualizada);

    if (this.encuesta?.id) {
      this.encuestaService.updateEncuesta(this.encuesta.id, encuestaActualizada).subscribe(
        (response) => {
          this.encuesta = response;
          this.mensajeExito = 'Encuesta actualizada con éxito';
          this.editando = false;
          this.cerrarMensajes();
        },
        (error) => {
          console.error('Error al actualizar:', error);
          this.mensajeError = 'Error al actualizar la encuesta.';
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

  cerrarMensajes(): void {
    setTimeout(() => {
      this.mensajeExito = null;
      this.mensajeError = null;
    }, 3000);
  }
}