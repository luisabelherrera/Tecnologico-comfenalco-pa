// src/app/components/departamento-detail/departamento-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Departamento } from 'src/app/models/departamento';
import { DepartamentoService } from 'src/app/services/deparamento/departamento.service';

@Component({
  selector: 'app-departamento-detail',
  templateUrl: './departamento-detail.component.html',
  styleUrls: ['./departamento-detail.component.scss']
})
export class DepartamentoDetailComponent implements OnInit {
  departamento?: Departamento;

  constructor(private departamentoService: DepartamentoService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.departamentoService.getDepartamentoById(id).subscribe(data => {
      this.departamento = data;
    });
  }
}
