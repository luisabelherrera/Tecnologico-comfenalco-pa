import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Aula } from 'src/app/models/aula';
import { AulaService } from 'src/app/services/aula/aula.service';


@Component({
  selector: 'app-aula-create',
  templateUrl: './aula-create.component.html',
  styleUrls: ['./aula-create.component.scss']
})
export class AulaCreateComponent {
  aula: Aula = { id: 0, nombre: '', capacidad: 0, ubicacion: '' };

  constructor(private aulaService: AulaService, private router: Router) { }

  createAula(): void {
    this.aulaService.createAula(this.aula).subscribe(() => {
      this.router.navigate(['/aulas']);
    });
  }
}
