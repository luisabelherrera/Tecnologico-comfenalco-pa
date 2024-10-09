import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Curricular } from 'src/app/models/entity/curricular.model';
import { CurricularService } from 'src/app/services/curricular/curricular.service'; // Asegúrate de que la ruta sea correcta
import { DocenteNivelDetalleCursoService } from 'src/app/services/docente-detalle/docente-nivel-detalle-curso.service';
import { DocenteNivelDetalleCurso } from 'src/app/models/entity/docente-nivel-detalle-curso.model';

@Component({
  selector: 'app-curricular-edit',
  templateUrl: './curricular-edit.component.html',
  styleUrls: ['./curricular-edit.component.scss']
})
export class CurricularEditComponent implements OnInit {
  curricular: Curricular = { descripcion: '', docenteNivelDetalleCurso: {} as DocenteNivelDetalleCurso, activo: true, fechaRegistro: new Date() };
  docentes: DocenteNivelDetalleCurso[] = []; // Lista de docentes
  id: number; // ID del curricular que se va a editar

  constructor(
    private curricularService: CurricularService,
    private route: ActivatedRoute,
    private router: Router,
    private docenteService: DocenteNivelDetalleCursoService // Inyecta el servicio de docentes
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id')); // Obtiene el ID del parámetro de la ruta
  }

  ngOnInit(): void {
    this.loadCurricular(); // Carga el curricular al iniciar
    this.loadDocentes(); // Carga los docentes disponibles
  }

  loadCurricular(): void {
    this.curricularService.getCurricularById(this.id).subscribe(
      (data) => {
        this.curricular = data; // Asigna los datos del curricular
        console.log('Curricular cargado:', this.curricular); // Log para verificar los datos
      },
      (error) => {
        console.error('Error al cargar el curricular', error);
      }
    );
  }

  loadDocentes(): void {
    this.docenteService.getAll().subscribe(
      (data: DocenteNivelDetalleCurso[]) => { 
        this.docentes = data; // Almacena directamente los docentes y sus detalles
      },
      (error) => {
        console.error('Error al cargar docentes', error);
      }
    );
  }
  cancelar(): void {
    this.router.navigate(['/curriculares']); // Redirige a la lista de curriculares
  }
  saveCurricular(): void {
    if (this.curricular) {
      console.log('Guardando curricular:', this.curricular); // Log para verificar los datos antes de guardar
      this.curricularService.updateCurricular(this.id, this.curricular).subscribe(
        () => {
          this.router.navigate(['/curriculares']); // Redirige a la lista de curriculares después de guardar
        },
        (error) => {
          console.error('Error al actualizar el curricular', error);
        }
      );
    }
  }
}
