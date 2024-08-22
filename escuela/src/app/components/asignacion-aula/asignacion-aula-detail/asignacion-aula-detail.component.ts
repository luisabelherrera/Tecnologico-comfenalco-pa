
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsignacionAula } from 'src/app/models/AsignacionAula.interface';
import { AsignacionAulaService } from 'src/app/services/asignacion-aula/asignacion-aula.service';

@Component({
  selector: 'app-asignacion-aula-detail',
  templateUrl: './asignacion-aula-detail.component.html',
  styleUrls: ['./asignacion-aula-detail.component.scss']
})
export class AsignacionAulaDetailComponent implements OnInit {
  asignacionAula: AsignacionAula | undefined;
  id: number;

  constructor(
    private asignacionAulaService: AsignacionAulaService,
    private route: ActivatedRoute
  ) {
    this.id = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.asignacionAulaService.getAsignacionAulaById(this.id).subscribe(data => {
      this.asignacionAula = data;
    });
  }
}
