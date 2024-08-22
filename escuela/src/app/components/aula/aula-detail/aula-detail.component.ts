import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Aula } from 'src/app/models/aula';
import { AulaService } from 'src/app/services/aula/aula.service';


@Component({
  selector: 'app-aula-detail',
  templateUrl: './aula-detail.component.html',
  styleUrls: ['./aula-detail.component.scss']
})
export class AulaDetailComponent implements OnInit {
  aula: Aula | undefined;

  constructor(
    private aulaService: AulaService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.aulaService.getAulaById(id).subscribe(aula => {
      this.aula = aula;
    });
  }
}
