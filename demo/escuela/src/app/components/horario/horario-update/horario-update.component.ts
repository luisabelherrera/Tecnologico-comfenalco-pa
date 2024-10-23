// src/app/components/horario-update/horario-update.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Horario } from 'src/app/models/entity/horario.model';
import { HorarioService } from 'src/app/services/horario/Horario.service';


@Component({
  selector: 'app-horario-update',
  templateUrl: './horario-update.component.html',
  styleUrls: ['./horario-update.component.scss']
})
export class HorarioUpdateComponent implements OnInit {
  horario: Horario | undefined;

  constructor(
    private horarioService: HorarioService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.horarioService.getAllHorarios().subscribe(horarios => {
      this.horario = horarios.find(h => h.idHorario === id);
    });
  }

  actualizarHorario() {
    if (this.horario) {
      this.horarioService.updateHorario(this.horario.idHorario, this.horario).subscribe(() => {
        this.router.navigate(['/horario']);
      });
    }
  }
}
