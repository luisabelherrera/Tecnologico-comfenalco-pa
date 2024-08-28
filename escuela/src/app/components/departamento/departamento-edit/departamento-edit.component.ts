
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Departamento } from 'src/app/models/departamento';
import { DepartamentoService } from 'src/app/services/deparamento/departamento.service';

@Component({
  selector: 'app-departamento-edit',
  templateUrl: './departamento-edit.component.html',
  styleUrls: ['./departamento-edit.component.scss']
})
export class DepartamentoEditComponent implements OnInit {
  departamento: Departamento = {
    id: 0,
    nombre: '',
    descripcion: ''
  };

  constructor(private departamentoService: DepartamentoService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.departamentoService.getDepartamentoById(id).subscribe(data => {
      this.departamento = data;
    });
  }

  updateDepartamento(): void {
    this.departamentoService.updateDepartamento(this.departamento).subscribe(() => {
      this.router.navigate(['/departamentos']);
    });
  }
}
