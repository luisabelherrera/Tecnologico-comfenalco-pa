// src/app/components/departamento-create/departamento-create.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Departamento } from 'src/app/models/departamento';
import { DepartamentoService } from 'src/app/services/deparamento/departamento.service';

@Component({
  selector: 'app-departamento-create',
  templateUrl: './departamento-create.component.html',
  styleUrls: ['./departamento-create.component.scss']
})
export class DepartamentoCreateComponent {
  departamento: Departamento = {
    id: 0,
    nombre: '',
    descripcion: ''
  };

  constructor(private departamentoService: DepartamentoService, private router: Router) { }

  saveDepartamento(): void {
    this.departamentoService.createDepartamento(this.departamento).subscribe(() => {
      this.router.navigate(['/departamentos']);
    });
  }
}
