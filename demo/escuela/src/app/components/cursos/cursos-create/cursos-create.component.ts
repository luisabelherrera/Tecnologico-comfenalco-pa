import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CursosService } from 'src/app/services/curso/curso.service';
import { Curso } from 'src/app/models/entity/curso.model';

@Component({
  selector: 'app-cursos-create',
  templateUrl: './cursos-create.component.html',
  styleUrls: ['./cursos-create.component.scss']
})
export class CursosCreateComponent implements OnInit {
  curso: Curso = {
    idCurso: 0,                      
    descripcion: '',
    activo: true,                  
    fechaRegistro: new Date()       
  };

  constructor(private cursosService: CursosService, private router: Router) {}

  ngOnInit(): void {}

  saveCurso(): void {
    this.cursosService.createCurso(this.curso).subscribe(
      () => {
        alert('Curso creado con éxito');
        this.router.navigate(['/cursos']); 
      },
      (error) => {
        console.error('Error al crear el curso', error);
      }
    );
  }
}
