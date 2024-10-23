// src/app/components/grado-seccion/grado-seccion.component.ts

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

  newGradoSeccion: GradoSeccion = {
    idGradoSeccion: 0,
    descripcionGrado: '',
    descripcionSeccion: '',
    activo: true,
    fechaRegistro: new Date()
  };

  editingId: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private gradoSeccionService: GradoSeccionService) {}

  ngOnInit(): void {
    this.loadGradoSecciones();
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
    if (this.editingId) {
      this.updateGradoSeccion();
    } else {
      this.gradoSeccionService.createGradoSeccion(this.newGradoSeccion).subscribe(() => {
        this.loadGradoSecciones();
        this.resetForm();
      });
    }
  }

  updateGradoSeccion(): void {
    this.gradoSeccionService.updateGradoSeccion(this.editingId!, this.newGradoSeccion).subscribe(() => {
      this.loadGradoSecciones();
      this.resetForm();
    });
  }

  editGradoSeccion(gradoSeccion: GradoSeccion): void {
    this.newGradoSeccion = { ...gradoSeccion };
    this.editingId = gradoSeccion.idGradoSeccion;
  }

  deleteGradoSeccion(id: number): void {
    this.gradoSeccionService.deleteGradoSeccion(id).subscribe(() => {
      this.loadGradoSecciones();
    });
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
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
