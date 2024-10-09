import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Inscripcion } from 'src/app/models/entity/Inscripcion.interface';

import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { AcudienteService } from 'src/app/services/acudiente/acudiente.service';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { Acudiente } from 'src/app/models/entity/Acudiente.interface';
import { NivelDetalle } from 'src/app/models/entity/NivelDetalle.interface';
import { NivelDetalleService } from 'src/app/services/niveldetalle/NivelDetalle.service';
import { InscripcionService } from 'src/app/services/matricula/matricula.service';

@Component({
  selector: 'app-matricula',
  templateUrl: './matricula.component.html',
  styleUrls: ['./matricula.component.scss'],
})
export class MatriculaComponent implements OnInit {
  matriculaForm: FormGroup;
  estudiantes: Estudiante[] = [];
  acudientes: Acudiente[] = [];
  nivelesDetalles: NivelDetalle[] = [];
  matriculas: Inscripcion[] = [];

  currentMatriculaId?: number;
  isEditing: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private matriculaService: InscripcionService,
    private estudianteService: EstudianteService,
    private acudienteService: AcudienteService,
    private nivelDetalleService: NivelDetalleService
  ) {
    this.matriculaForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadEstudiantes();
    this.loadAcudientes();
    this.loadNivelesDetalles();
    this.loadMatriculas();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      valorCodigo: ['', Validators.required],
      codigo: ['', Validators.required],
      situacion: [''],
      nivelDetalle: [null, Validators.required],
      estudiante: [null, Validators.required],
      acudiente: [null, Validators.required],
      institucionProcedencia: [''],
      esRepitente: [false],
      activo: [true],
      fechaRegistro: [new Date()],
    });
  }

  loadEstudiantes(): void {
    this.estudianteService.getAllEstudiantes().subscribe((data) => {
      this.estudiantes = data;
    });
  }

  loadAcudientes(): void {
    this.acudienteService.getAcudientes().subscribe((data) => {
      this.acudientes = data;
    });
  }

  loadNivelesDetalles(): void {
    this.nivelDetalleService.getAll().subscribe((data) => {
      this.nivelesDetalles = data;
    });
  }

  loadMatriculas(): void {
    this.matriculaService.getAllInscripciones().subscribe((data) => {
      this.matriculas = data;
    });
  }
  onSubmit(): void {
    if (this.matriculaForm.valid) {
      const matricula: Inscripcion = this.createMatriculaFromForm();
      console.log('Datos a enviar:', matricula); // Log de los datos que se envían
    
      this.matriculaService.createInscripcion(matricula).subscribe(
        (response) => {
          alert('Inscripción registrada exitosamente');
          this.loadMatriculas();
          this.resetForm();
        },
        (error) => {
          // Manejo detallado de errores
          console.error('Error al registrar la inscripción:', error);
          const errorMessage = error.error?.message || 'Error desconocido';
          alert(`Ocurrió un error al registrar la inscripción: ${errorMessage}`);
        }
      );
    } else {
      alert('Por favor, complete todos los campos requeridos.');
    }
  }
  
  

  createMatriculaFromForm(): Inscripcion {
    const selectedEstudiante = this.estudiantes.find(est => est.id === this.matriculaForm.value.estudiante);
    const selectedAcudiente = this.acudientes.find(acud => acud.idAcudiente === this.matriculaForm.value.acudiente);
    const selectedNivelDetalle = this.nivelesDetalles.find(nivel => nivel.idNivelDetalle === this.matriculaForm.value.nivelDetalle);

    return {
      idInscripcion: this.isEditing ? this.currentMatriculaId! : 0,
      valorCodigo: this.matriculaForm.value.valorCodigo,
      codigo: this.matriculaForm.value.codigo,
      situacion: this.matriculaForm.value.situacion,
      institucionProcedencia: this.matriculaForm.value.institucionProcedencia,
      esRepitente: this.matriculaForm.value.esRepitente,
      activo: this.matriculaForm.value.activo,
      fechaRegistro: this.matriculaForm.value.fechaRegistro,
      estudiante: {
        id: selectedEstudiante?.id || null,
        valorCodigo: selectedEstudiante?.valorCodigo || '',
        codigo: selectedEstudiante?.codigo || '',
        nombres: selectedEstudiante?.nombres || '',
        apellidos: selectedEstudiante?.apellidos || '',
        documentoIdentidad: selectedEstudiante?.documentoIdentidad || '',
        fechaNacimiento: selectedEstudiante?.fechaNacimiento || new Date(),
        sexo: selectedEstudiante?.sexo || '',
        ciudad: selectedEstudiante?.ciudad || '',
        direccion: selectedEstudiante?.direccion || '',
        activo: selectedEstudiante?.activo || true,
      },
      acudiente: {
        idAcudiente: selectedAcudiente?.idAcudiente || null,
        nombres: selectedAcudiente?.nombres || '',
        apellidos: selectedAcudiente?.apellidos || '',
        documentoIdentidad: selectedAcudiente?.documentoIdentidad || '',
        ciudad: selectedAcudiente?.ciudad || '',
        direccion: selectedAcudiente?.direccion || '',
        estadoCivil: selectedAcudiente?.estadoCivil || '',
        sexo: selectedAcudiente?.sexo || '',
        fechaNacimiento: selectedAcudiente?.fechaNacimiento || new Date(),
        activo: selectedAcudiente?.activo || true,
        parentesco: selectedAcudiente?.parentesco || '',
      },
      nivelDetalle: {
        idNivelDetalle: selectedNivelDetalle?.idNivelDetalle || null,
        nivel: selectedNivelDetalle?.nivel || null,
        gradoSeccion: selectedNivelDetalle?.gradoSeccion || null,
        totalVacantes: selectedNivelDetalle?.totalVacantes || 0,
        vacantesDisponibles: selectedNivelDetalle?.vacantesDisponibles || 0,
        vacantesOcupadas: selectedNivelDetalle?.vacantesOcupadas || 0,
        activo: selectedNivelDetalle?.activo || true,
      },
    };
  }

  deleteMatricula(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta inscripción?')) {
      this.matriculaService.deleteInscripcion(id).subscribe(
        (response) => {
          alert('Inscripción eliminada exitosamente');
          this.loadMatriculas();
        },
        (error) => {
          console.error('Error al eliminar la inscripción:', error);
          alert('Ocurrió un error al eliminar la inscripción');
        }
      );
    }
  }

  editMatricula(matricula: Inscripcion): void {
    this.currentMatriculaId = matricula.idInscripcion;
    this.isEditing = true;
    this.matriculaForm.patchValue({
      valorCodigo: matricula.valorCodigo,
      codigo: matricula.codigo,
      situacion: matricula.situacion,
      nivelDetalle: matricula.nivelDetalle?.idNivelDetalle,
      estudiante: matricula.estudiante?.id,
      acudiente: matricula.acudiente?.idAcudiente,
      institucionProcedencia: matricula.institucionProcedencia,
      esRepitente: matricula.esRepitente,
      activo: matricula.activo,
      fechaRegistro: matricula.fechaRegistro,
    });
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentMatriculaId = undefined;
    this.matriculaForm.reset();
  }
}
