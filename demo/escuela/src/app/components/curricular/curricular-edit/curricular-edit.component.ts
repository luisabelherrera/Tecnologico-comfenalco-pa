import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Curricular } from 'src/app/models/entity/curricular.model';
import { CurricularService } from 'src/app/services/curricular/curricular.service';  
import { DocenteNivelDetalleCursoService } from 'src/app/services/docente-detalle/docente-nivel-detalle-curso.service';
import { DocenteNivelDetalleCurso } from 'src/app/models/entity/docente-nivel-detalle-curso.model';

@Component({
  selector: 'app-curricular-edit',
  templateUrl: './curricular-edit.component.html',
  styleUrls: ['./curricular-edit.component.scss']
})
export class CurricularEditComponent implements OnInit {
  curricular: Curricular = { descripcion: '', docenteNivelDetalleCurso: {} as DocenteNivelDetalleCurso, activo: true, fechaRegistro: new Date() };
  docentes: DocenteNivelDetalleCurso[] = [];  
  id: number;  

  constructor(
    private curricularService: CurricularService,
    private route: ActivatedRoute,
    private router: Router,
    private docenteService: DocenteNivelDetalleCursoService 
  ) {
    this.id = Number(this.route.snapshot.paramMap.get('id')); 
  }

  ngOnInit(): void {
    this.loadCurricular(); 
    this.loadDocentes();  
  }

  loadCurricular(): void {
    this.curricularService.getCurricularById(this.id).subscribe(
      (data) => {
        this.curricular = data;  
        console.log('Curricular cargado:', this.curricular);  
      },
      (error) => {
        console.error('Error al cargar el curricular', error);
      }
    );
  }

  loadDocentes(): void {
    this.docenteService.getAll().subscribe(
      (data: DocenteNivelDetalleCurso[]) => { 
        this.docentes = data;  
      },
      (error) => {
        console.error('Error al cargar docentes', error);
      }
    );
  }
  cancelar(): void {
    this.router.navigate(['/curriculares']);  
  }
  saveCurricular(): void {
    if (this.curricular) {
      console.log('Guardando curricular:', this.curricular);  
      this.curricularService.updateCurricular(this.id, this.curricular).subscribe(
        () => {
          this.router.navigate(['/curriculares']);  
        },
        (error) => {
          console.error('Error al actualizar el curricular', error);
        }
      );
    }
  }
}
