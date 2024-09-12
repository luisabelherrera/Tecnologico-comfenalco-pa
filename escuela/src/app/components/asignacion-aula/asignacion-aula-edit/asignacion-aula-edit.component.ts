import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AsignacionAula } from 'src/app/models/AsignacionAula.interface';
import { AsignacionAulaService } from 'src/app/services/asignacion-aula/asignacion-aula.service';

@Component({
  selector: 'app-asignacion-aula-edit',
  templateUrl: './asignacion-aula-edit.component.html',
  styleUrls: ['./asignacion-aula-edit.component.scss']
})
export class AsignacionAulaEditComponent implements OnInit {
  asignacionAula: AsignacionAula = { curso: { id: 0 }, aula: { id: 0 }, diaSemana: '', horaInicio: '', horaFin: '' };
  id: number;

  constructor(
    private asignacionAulaService: AsignacionAulaService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.id = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.asignacionAulaService.getAsignacionAulaById(this.id).subscribe(data => {
      this.asignacionAula = data;
    });
  }

  updateAsignacionAula(): void {
    this.asignacionAulaService.updateAsignacionAula(this.id, this.asignacionAula).subscribe(() => {
      this.router.navigate(['/asignaciones-aulas']);
    });
  }
}
