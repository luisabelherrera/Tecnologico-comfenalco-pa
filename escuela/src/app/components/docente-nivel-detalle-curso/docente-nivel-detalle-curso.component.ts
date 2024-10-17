import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocenteNivelDetalleCurso } from 'src/app/models/entity/docente-nivel-detalle-curso.model';
import { Docente } from 'src/app/models/entity/docente.model';
import { DocenteNivelDetalleCursoService } from 'src/app/services/docente-detalle/docente-nivel-detalle-curso.service';
import { DocenteService } from 'src/app/services/Docente/Docente.service';
import { NivelDetalleCursoService } from 'src/app/services/niveldetallecurso/nivel-detalle-curso.service';

@Component({
  selector: 'app-docente-nivel-detalle-curso',
  templateUrl: './docente-nivel-detalle-curso.component.html',
  styleUrls: ['./docente-nivel-detalle-curso.component.scss']
})
export class DocenteNivelDetalleCursoComponent implements OnInit, OnDestroy {
  docenteNivelDetalleCursos: DocenteNivelDetalleCurso[] = [];
  paginatedData: DocenteNivelDetalleCurso[] = [];
  filteredData: DocenteNivelDetalleCurso[] = [];
  nuevoDocenteNivelCurso: Partial<DocenteNivelDetalleCurso> = {};
  editingDocenteNivelCurso: DocenteNivelDetalleCurso | null = null;
  docentes: Docente[] = [];
  nivelesDetalle: any[] = [];
  loading: boolean = false;
  pageSize: number = 5; 
  pageIndex: number = 0; 

  private subscriptions: Subscription = new Subscription();

  constructor(
    private docenteNivelDetalleCursoService: DocenteNivelDetalleCursoService,
    private docenteService: DocenteService,
    private nivelDetalleCursoService: NivelDetalleCursoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData(); 
    this.resetForm();
  }
  

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  loadData(): void {
    this.loading = true;
    this.loadAll();
    this.loadDocentes();
    this.loadNivelesDetalle();
  }

  loadAll(): void {
    const loadSub = this.docenteNivelDetalleCursoService.getAll().subscribe(
      (data: DocenteNivelDetalleCurso[]) => {
       
        this.docenteNivelDetalleCursos = [];
        this.filteredData = [];
        this.docenteNivelDetalleCursos = data;  
        this.filteredData = data;  
        this.updatePaginatedData(); 
        this.loading = false;
      },
      (error) => {
        console.error('Error cargando docentes:', error);
        this.snackBar.open('Error al cargar docentes. Inténtalo de nuevo.', 'Cerrar', {
          duration: 3000,
        });
        this.loading = false;
      }
    );
    this.subscriptions.add(loadSub);
  }
  
 
  updatePaginatedData(): void {
    const startIndex = this.pageIndex * this.pageSize;
    this.paginatedData = this.filteredData.slice(startIndex, startIndex + this.pageSize);
  }
 
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase(); // Cast to HTMLInputElement
    this.filteredData = this.docenteNivelDetalleCursos.filter(docenteNivelCurso =>
      docenteNivelCurso.docente.nombres.toLowerCase().includes(filterValue) ||
      docenteNivelCurso.docente.apellidos.toLowerCase().includes(filterValue) ||
      docenteNivelCurso.nivelDetalleCurso.curso.descripcion.toLowerCase().includes(filterValue)
    );
    this.pageIndex = 0; 
    this.updatePaginatedData();  
  }
  
  
 
  changePage(event: any): void {
    this.pageIndex = event.pageIndex;  
    this.pageSize = event.pageSize; 
    this.updatePaginatedData(); 
  }

  loadDocentes(): void {
    const docentesSub = this.docenteService.getAllDocentes().subscribe(
      (data: Docente[]) => {
        this.docentes = data;
        console.log('Docentes loaded:', this.docentes);
      },
      (error) => {
        console.error('Error cargando docentes:', error);
        this.snackBar.open('Error al cargar docentes. Inténtalo de nuevo.', 'Cerrar', {
          duration: 3000,
        });
      }
    );
    this.subscriptions.add(docentesSub);
  }

  loadNivelesDetalle(): void {
    const nivelesSub = this.nivelDetalleCursoService.getAll().subscribe(
      (data: any[]) => {
        this.nivelesDetalle = data;
        console.log('Niveles de detalle cargados:', this.nivelesDetalle);
      },
      (error) => {
        console.error('Error cargando niveles de detalle:', error);
        this.snackBar.open('Error al cargar niveles de detalle. Inténtalo de nuevo.', 'Cerrar', {
          duration: 3000,
        });
      }
    );
    this.subscriptions.add(nivelesSub);
  }

  create(): void {
    console.log('Nuevo Docente Nivel Curso:', this.nuevoDocenteNivelCurso);
    const createSub = this.docenteNivelDetalleCursoService.create(this.nuevoDocenteNivelCurso as DocenteNivelDetalleCurso).subscribe(
      (docente) => {
        if (docente && docente.idDocenteNivelDetalleCurso) {
   
          this.docenteNivelDetalleCursos.push(docente);
          this.filteredData.push(docente);
          this.updatePaginatedData();
          this.snackBar.open('Docente agregado exitosamente', 'Cerrar', { duration: 3000 });
        } else {
          console.warn('No se pudo agregar el docente.');
        }
        this.resetForm();
      },
      (error) => {
        console.error('Error al agregar docente:', error);
        this.snackBar.open('Error al agregar docente. Inténtalo de nuevo.', 'Cerrar', { duration: 3000 });
      }
    );
    this.subscriptions.add(createSub);
  }
  
  

  edit(docente: DocenteNivelDetalleCurso): void {
    this.editingDocenteNivelCurso = docente;
    this.nuevoDocenteNivelCurso = { ...docente };
  }

  update(): void {
    if (this.editingDocenteNivelCurso) {
      const updatedDocente = {
        ...this.editingDocenteNivelCurso,
        ...this.nuevoDocenteNivelCurso,
      };

      const updateSub = this.docenteNivelDetalleCursoService.update(this.editingDocenteNivelCurso.idDocenteNivelDetalleCurso, updatedDocente).subscribe(
        () => {
          const index = this.docenteNivelDetalleCursos.findIndex(d => d.idDocenteNivelDetalleCurso === this.editingDocenteNivelCurso!.idDocenteNivelDetalleCurso);
          if (index !== -1) {
            this.docenteNivelDetalleCursos[index] = updatedDocente;
            this.filteredData[index] = updatedDocente; 
            this.updatePaginatedData();  
          }
          this.resetForm();
          this.snackBar.open('Docente actualizado exitosamente', 'Cerrar', {
            duration: 3000,
          });
        },
        (error) => {
          console.error('Error al actualizar docente:', error);
          this.snackBar.open('Error al actualizar docente. Inténtalo de nuevo.', 'Cerrar', {
            duration: 3000,
          });
        }
      );
      this.subscriptions.add(updateSub);
    }
  }

  delete(id: number): void {
    const deleteSub = this.docenteNivelDetalleCursoService.delete(id).subscribe(
      () => {
        this.docenteNivelDetalleCursos = this.docenteNivelDetalleCursos.filter(docente => docente.idDocenteNivelDetalleCurso !== id);
        this.filteredData = this.filteredData.filter(docente => docente.idDocenteNivelDetalleCurso !== id);  
        this.updatePaginatedData(); 
      },
      (error) => {
        console.error('Error al eliminar docente:', error);
        this.snackBar.open('Error al eliminar docente. Inténtalo de nuevo.', 'Cerrar', {
          duration: 3000,
        });
      }
    );
    this.subscriptions.add(deleteSub);
  }

  resetForm(): void {
    this.nuevoDocenteNivelCurso = this.initializeNuevoDocente();
    this.editingDocenteNivelCurso = null;
  }

  private initializeNuevoDocente(): Partial<DocenteNivelDetalleCurso> {
    return {
      docente: this.initializeDocente(),
      nivelDetalleCurso: this.initializeNivelDetalleCurso(),
      activo: true,
      fechaRegistro: new Date(),
    };
  }

  private initializeDocente(): Docente {
    return {
      idDocente: 0,
      valorCodigo: 0,
      codigo: '',
      documentoIdentidad: '',
      nombres: '',
      apellidos: '',
      fechaNacimiento: new Date(),
      sexo: '',
      gradoEstudio: '',
      ciudad: '',
      direccion: '',
      email: '',
      numeroTelefono: '',
      activo: true,
      fechaRegistro: new Date(),
    };
  }

  private initializeNivelDetalleCurso(): any {
    return {
      idNivelDetalleCurso: 0,
      nivelDetalle: {
        idNivelDetalle: 1,
        gradoSeccion: {
          idGradoSeccion: 1,
          descripcionGrado: 'Grado 1',
          descripcionSeccion: 'Sección A',
          activo: true,
        },
        totalVacantes: 30,
        vacantesDisponibles: 10,
        vacantesOcupadas: 20,
        activo: true,
        nivel: {
          idNivel: 1,
          periodo: {
            idPeriodo: 1,
            descripcion: '2024-2025',
            fechaInicio: new Date('2024-01-01'),
            fechaFin: new Date('2025-12-31'),
            activo: true,
          },
          descripcionNivel: 'Nivel 1',
          descripcionTurno: 'Mañana',
          horaInicio: '08:00',
          horaFin: '12:00',
          activo: true,
        },
      },
      curso: {
        idCurso: 1,
        descripcion: 'Curso de Matemáticas',
        activo: true,
        fechaRegistro: new Date(),
      },
      activo: true,
      fechaRegistro: new Date(),
    };
  }
}
