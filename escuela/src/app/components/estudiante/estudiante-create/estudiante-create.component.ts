import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Estudiante } from 'src/app/models/estudiante.model';
import { tutor } from 'src/app/models/tutor.interface';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { TutorService } from 'src/app/services/tutor/tutor.service';

@Component({
  selector: 'app-estudiante-create',
  templateUrl: './estudiante-create.component.html',
  styleUrls: ['./estudiante-create.component.scss'],
})
export class EstudianteCreateComponent implements OnInit {
  estudiante: Estudiante = {
    id: 0,
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    grado: '',
    direccion: '',
    telefono: '',
    email: '',
    genero: '',
    documento: '',
    estado: '',
    tutor: { id: 0, nombre: '', apellido: '', telefono: '', email: '' },
  };

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

  constructor(
    private estudianteService: EstudianteService,
    private tutorService: TutorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTutors();
  }

  loadTutors(): void {
    this.tutorService.getAllTutores().subscribe((tutors) => {
      this.tutors = tutors;
    });
  }

  saveEstudiante(): void {
    this.estudianteService.createEstudiante(this.estudiante).subscribe(() => {
      this.router.navigate(['/estudiantes']);
    });
  }
}
