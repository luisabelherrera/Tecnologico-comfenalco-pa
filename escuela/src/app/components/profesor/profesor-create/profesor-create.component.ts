import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Profesor } from 'src/app/models/profesor';
import { ProfesorService } from 'src/app/services/profesor/profesor.service';
import { Departamento } from 'src/app/models/departamento';
import { DepartamentoService } from 'src/app/services/deparamento/departamento.service';

@Component({
  selector: 'app-profesor-create',
  templateUrl: './profesor-create.component.html',
  styleUrls: ['./profesor-create.component.scss']
})
export class ProfesorCreateComponent implements OnInit {
  profesor: Profesor = {
    id: 0,
    nombre: '',
    apellido: '',
    especialidad: '',
    telefono: '',
    email: '',
    departamento: { id: 0 }
  };
  departamentos: Departamento[] = [];

  constructor(
    private profesorService: ProfesorService,
    private departamentoService: DepartamentoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDepartamentos();
  }

  loadDepartamentos(): void {
    this.departamentoService.getAllDepartamentos().subscribe(departamentos => {
      this.departamentos = departamentos;
    });
  }

  saveProfesor(): void {
    this.profesorService.createProfesor(this.profesor).subscribe(() => {
      this.router.navigate(['/profesores']);
    });
  }
}
