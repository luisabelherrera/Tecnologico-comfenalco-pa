import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Acudiente } from 'src/app/models/entity/Acudiente.interface';
import { AcudienteService } from 'src/app/services/acudiente/acudiente.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select'; // Importar MatSelectChange

@Component({
  selector: 'app-acudiente-list',
  templateUrl: './acudiente-list.component.html',
  styleUrls: ['./acudiente-list.component.scss']
})
export class AcudienteListComponent implements OnInit, AfterViewInit {
  acudientes: Acudiente[] = [];
  dataSource = new MatTableDataSource<Acudiente>();
  displayedColumns: string[] = ['id', 'nombres', 'apellidos', 'documentoIdentidad', 'ciudad', 'activo', 'actions'];
  filterType: string = 'nombre'; // Valor predeterminado para el filtro

  @ViewChild(MatPaginator) paginator!: MatPaginator; 

  constructor(private acudienteService: AcudienteService, private router: Router) {}

  ngOnInit(): void {
    this.loadAcudientes();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; 
  }

  loadAcudientes(): void {
    this.acudienteService.getAcudientes().subscribe(
      (data) => {
        this.acudientes = data;
        this.dataSource.data = this.acudientes; 
      },
      (error) => {
        console.error('Error al cargar los acudientes', error);
      }
    );
  }

  deleteAcudiente(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este acudiente?')) {
      this.acudienteService.deleteAcudiente(id).subscribe(() => {
        this.loadAcudientes(); 
      },
      (error) => {
        console.error('Error al eliminar el acudiente', error);
      });
    }
  }

  applyFilter(event: Event | MatSelectChange): void {
    if (event instanceof MatSelectChange) {
      this.filterType = event.value; // Actualizar el tipo de filtro cuando se cambia la selección
    } else {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filterPredicate = (data: Acudiente, filter: string) => {
        const normalizedFilter = filter.trim().toLowerCase();
        if (this.filterType === 'nombre') {
          return data.nombres.toLowerCase().includes(normalizedFilter);
        } else if (this.filterType === 'documento') {
          return data.documentoIdentidad.toLowerCase().includes(normalizedFilter);
        }
        return false;
      };
      this.dataSource.filter = filterValue;
    }
  }
}
