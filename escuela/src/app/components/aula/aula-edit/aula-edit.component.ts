import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Aula } from 'src/app/models/aula';
import { AulaService } from 'src/app/services/aula/aula.service';

@Component({
  selector: 'app-aula-edit',
  templateUrl: './aula-edit.component.html',
  styleUrls: ['./aula-edit.component.scss']
})



export class AulaEditComponent implements OnInit {
  aula: Aula = { id: 0, nombre: '', capacidad: 0, ubicacion: '' };

  constructor(
    private aulaService: AulaService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.aulaService.getAulaById(id).subscribe(aula => {
      this.aula = aula;
    });
  }

  updateAula(): void {
    this.aulaService.updateAula(this.aula).subscribe(() => {
      this.router.navigate(['/aulas']);
    });
  }
}
