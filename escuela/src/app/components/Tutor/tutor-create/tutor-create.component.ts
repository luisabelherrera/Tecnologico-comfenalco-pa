import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { tutor } from 'src/app/models/tutor.interface';

import { TutorService } from 'src/app/services/tutor/tutor.service';

@Component({
  selector: 'app-tutor-create',
  templateUrl: './tutor-create.component.html',
  styleUrls: ['./tutor-create.component.css']
})
export class TutorCreateComponent {
  tutor: tutor = { nombre: '', apellido: '', telefono: '', email: '' };

  constructor(private tutorService: TutorService, private router: Router) {}

  createTutor(): void {
    this.tutorService.createTutor(this.tutor).subscribe(() => {
      this.router.navigate(['/tutor']);
    });
  }
}
