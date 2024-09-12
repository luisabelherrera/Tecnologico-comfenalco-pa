import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Inscripcion } from 'src/app/models/inscripcion.interface';
import { InscripcionService } from 'src/app/services/inscripcion/inscripcion.service';

@Component({
  selector: 'app-inscripcion-detail',
  templateUrl: './inscripcion-detail.component.html',
  styleUrls: ['./inscripcion-detail.component.scss']
})
export class InscripcionDetailComponent implements OnInit {

  inscripcion: Inscripcion | undefined;

  constructor(
    private inscripcionService: InscripcionService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.inscripcionService.getInscripcionById(+id).subscribe(data => {
        this.inscripcion = data;
      });
    }
  }

  deleteInscripcion(id: number): void {
    this.inscripcionService.deleteInscripcion(id).subscribe(() => {
      this.router.navigate(['/inscripciones']);
    });
  }
}