import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GradoSeccion } from 'src/app/models/entity/GradoSeccion.interface';
import { GradoSeccionService } from 'src/app/services/grado-seccion/grado-seccion.service';

@Component({
  selector: 'app-grado-seccion',
  templateUrl: './grado-seccion.component.html',
  styleUrls: ['./grado-seccion.component.scss']
})
export class GradoSeccionComponent implements OnInit {
  gradoSecciones: GradoSeccion[] = [];
  displayedColumns: string[] = ['descripcionGrado', 'descripcionSeccion', 'activo', 'fechaRegistro', 'actions'];
  dataSource = new MatTableDataSource<GradoSeccion>([]);
  showForm: boolean = false;
  editingId: number | null = null;

  newGradoSeccion: GradoSeccion = {
    idGradoSeccion: 0,
    descripcionGrado: '',
    descripcionSeccion: '',
    activo: true,
    fechaRegistro: new Date()
  };

  gradoOptions: string[] = [
    'Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto',
    'Sexto', 'Séptimo', 'Octavo', 'Noveno', 'Décimo', 'Undécimo'
  ];
  seccionOptions: string[] = ['A', 'B', 'C', 'D', 'E'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private gradoSeccionService: GradoSeccionService) {}

  ngOnInit(): void {
    this.loadGradoSecciones();
  }

  toggleView(show: boolean): void {
    this.showForm = show;
    this.editingId = null;
    if (!show) {
      this.loadGradoSecciones();
      this.resetForm();
    }
  }

  loadGradoSecciones(): void {
    this.gradoSeccionService.getAllGradoSecciones().subscribe(
      (data) => {
        this.gradoSecciones = data;
        this.dataSource.data = this.gradoSecciones;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Error fetching grado secciones', error);
      }
    );
  }

  createGradoSeccion(): void {
    if (!this.newGradoSeccion.descripcionGrado || !this.newGradoSeccion.descripcionSeccion) {
      console.error('Campos requeridos faltantes');
      return;
    }
    if (this.editingId) {
      this.updateGradoSeccion();
    } else {
      this.gradoSeccionService.createGradoSeccion(this.newGradoSeccion).subscribe(
        () => {
          this.loadGradoSecciones();
          this.toggleView(false);
        },
        (error) => console.error('Error creating grado seccion', error)
      );
    }
  }

  updateGradoSeccion(): void {
    if (!this.newGradoSeccion.descripcionGrado || !this.newGradoSeccion.descripcionSeccion) {
      console.error('Campos requeridos faltantes');
      return;
    }
    this.gradoSeccionService.updateGradoSeccion(this.editingId!, this.newGradoSeccion).subscribe(
      () => {
        this.loadGradoSecciones();
        this.toggleView(false);
      },
      (error) => console.error('Error updating grado seccion', error)
    );
  }

  editGradoSeccion(gradoSeccion: GradoSeccion): void {
    this.newGradoSeccion = { ...gradoSeccion };
    this.editingId = gradoSeccion.idGradoSeccion;
    this.showForm = true;
  }

  deleteGradoSeccion(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta sección de grado?')) {
      this.gradoSeccionService.deleteGradoSeccion(id).subscribe(
        () => this.loadGradoSecciones(),
        (error) => console.error('Error deleting grado seccion', error)
      );
    }
  }

  resetForm(): void {
    this.newGradoSeccion = {
      idGradoSeccion: 0,
      descripcionGrado: '',
      descripcionSeccion: '',
      activo: true,
      fechaRegistro: new Date()
    };
    this.editingId = null;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}