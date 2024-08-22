import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { tutor } from 'src/app/models/tutor.interface';


import { TutorService } from 'src/app/services/tutor/tutor.service';

@Component({
  selector: 'app-tutor-edit',
  templateUrl: './tutor-edit.component.html',
  styleUrls: ['./tutor-edit.component.css']
})
export class TutorEditComponent implements OnInit {
  tutor: tutor = { id: 0, nombre: '', apellido: '', telefono: '', email: '' };

  constructor(
    private route: ActivatedRoute,
    private tutorService: TutorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getTutor();
  }

  getTutor(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tutorService.getTutorById(id).subscribe(tutor => this.tutor = tutor);
  }

  updateTutor(): void {
    this.tutorService.updateTutor(this.tutor).subscribe(() => {
      this.router.navigate(['/tutor']);
    });
  }
}