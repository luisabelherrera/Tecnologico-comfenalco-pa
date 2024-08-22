import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AsignacionAula } from 'src/app/models/AsignacionAula.interface';
import { AsignacionAulaService } from 'src/app/services/asignacion-aula/asignacion-aula.service';

@Component({
  selector: 'app-asignacion-aula-create',
  templateUrl: './asignacion-aula-create.component.html',
  styleUrls: ['./asignacion-aula-create.component.scss']
})
export class AsignacionAulaCreateComponent {
  asignacionAula: AsignacionAula = { curso: { id: 0 }, aula: { id: 0 }, diaSemana: '', horaInicio: '', horaFin: '' };

  constructor(private asignacionAulaService: AsignacionAulaService, private router: Router) { }

  createAsignacionAula(): void {
    this.asignacionAulaService.createAsignacionAula(this.asignacionAula).subscribe(() => {
      this.router.navigate(['/asignaciones-aulas']);
    });
  }
}
