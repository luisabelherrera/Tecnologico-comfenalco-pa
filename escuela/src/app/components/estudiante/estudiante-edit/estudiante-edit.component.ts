import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { TutorService } from 'src/app/services/tutor/tutor.service';
import { tutor } from 'src/app/models/tutor.interface';

@Component({
  selector: 'app-estudiante-edit',
  templateUrl: './estudiante-edit.component.html',
  styleUrls: ['./estudiante-edit.component.scss']
})
export class EstudianteEditComponent implements OnInit {
  estudianteForm: FormGroup;
  tutors: tutor[] = [];
  generos = [
    { value: 'masculino', label: 'Masculino' },
    { value: 'femenino', label: 'Femenino' },
    { value: 'otro', label: 'Otro' },
  ];
  estados = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' },
    { value: 'suspendido', label: 'Suspendido' },
  ];
  id: number | undefined;

  constructor(
    private fb: FormBuilder,
    private estudianteService: EstudianteService,
    private tutorService: TutorService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.estudianteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      grado: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      documento: ['', Validators.required],
      genero: ['', Validators.required],
      estado: ['', Validators.required],
      tutor: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    if (this.id) {
      this.estudianteService.getEstudianteById(this.id).subscribe(estudiante => {
        this.estudianteForm.patchValue({
          ...estudiante,
          fechaNacimiento: estudiante.fechaNacimiento?.substring(0, 10) // Asegúrate de que la fecha esté en el formato correcto
        });
      }, error => {
        console.error('Error al cargar los datos del estudiante', error);
      });
    }

    this.tutorService.getAllTutores().subscribe(tutors => {
      this.tutors = tutors;
    });
  }

  onSubmit(): void {
    if (this.estudianteForm.valid && this.id) {
      const formData = this.estudianteForm.value;

      if (typeof formData.tutor === 'string') {
       formData.tutor = { id: parseInt(formData.tutor, 10), nombre: '', apellido: '', telefono: '', email: '' };
      }
  
      if (formData.fechaNacimiento === '0001-12-12') {
        formData.fechaNacimiento = ''; 
      }
  
      console.log('Datos enviados:', formData);
  
      this.estudianteService.updateEstudiante(this.id, formData).subscribe(
        (response) => {
          console.log('Estudiante actualizado:', response);
          this.router.navigate(['/estudiantes']);
        },
        (error) => {
          console.error('Error al actualizar el estudiante', error);
        }
      );
    }
  }

}