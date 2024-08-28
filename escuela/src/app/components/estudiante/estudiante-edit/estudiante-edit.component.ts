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
      tutor: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id')!;
    if (this.id) {
      this.estudianteService.getEstudianteById(this.id).subscribe(estudiante => {
        this.estudianteForm.patchValue({
          ...estudiante,
          fechaNacimiento: estudiante.fechaNacimiento?.substring(0, 10)
        });
      });
    }

    this.tutorService.getAllTutores().subscribe(tutors => {
      this.tutors = tutors;
    });
  }

  onSubmit(): void {
    if (this.estudianteForm.valid && this.id) {
      this.estudianteService.updateEstudiante(this.id, this.estudianteForm.value).subscribe(() => {
        this.router.navigate(['/estudiantes']);
      });
    }
  }
}
