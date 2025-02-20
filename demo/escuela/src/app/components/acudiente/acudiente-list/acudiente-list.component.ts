import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Acudiente } from 'src/app/models/entity/Acudiente.interface';
import { AcudienteService } from 'src/app/services/acudiente/acudiente.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-acudiente-list',
  templateUrl: './acudiente-list.component.html',
  styleUrls: ['./acudiente-list.component.scss']
})
export class AcudienteListComponent implements OnInit, AfterViewInit {
  acudientes: Acudiente[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['nombres', 'apellidos', 'documentoIdentidad', 'ciudad', 'activo', 'actions'];
  filtro: string = '';
  filterType: string = 'nombre'; 
  totalElements: number = 0; // Total de elementos
  totalPages: number = 0;    // Total de páginas
  pageSize: number = 5;    // Tamaño de página predeterminado
  pageIndex: number = 0;     // Página actual
  @ViewChild(MatSort) sort: MatSort;  
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private acudienteService: AcudienteService, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadAcudientes(0, 5);  // Página inicial, 10 elementos por página
  }


  ngAfterViewInit(): void {
    this.loadAcudientes(this.pageIndex, this.pageSize,);
    this.dataSource.sort = this.sort;
    
  }
  onSearch(): void {
    this.pageIndex = 0;  // Reset to the first page
    this.loadAcudientes(this.pageIndex, this.pageSize); // Pass the pageIndex and pageSize
  }
  
  

  loadAcudientes(page: number, size: number): void {
    this.acudienteService.getAcudientes(page, size).subscribe(
      (data: any) => {
        this.acudientes = data.content;  // Lista de acudientes
        this.totalElements = data.totalElements;  // Total de elementos
        this.totalPages = data.totalPages;  // Total de páginas
        this.dataSource.data = this.acudientes;  // Actualiza la fuente de datos de la tabla
  
        // Asegurarse de que el paginador se actualice correctamente
        if (this.paginator) {
          this.paginator.pageIndex = page; // Actualiza el índice de la página
          this.paginator.pageSize = size;  // Asegura que el tamaño de página se mantenga
        }
      },
      (error) => {
        console.error('Error cargando acudientes:', error);
        this.snackBar.open('Error cargando acudientes', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    );
  }
  

  deleteAcudiente(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este acudiente?')) {
      this.acudienteService.deleteAcudiente(id).subscribe(() => {
        // Actualizar la lista eliminando el elemento sin recargar toda la data
        this.acudientes = this.acudientes.filter(acudiente => acudiente.idAcudiente !== id);
        this.dataSource.data = this.acudientes;
  
        // Mostrar notificación de éxito
        this.snackBar.open('Acudiente eliminado correctamente', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      },
      (error) => {
        console.error('Error al eliminar el acudiente', error);
        this.snackBar.open('Error al eliminar el acudiente', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      });
    }
  }

  metodoabsorver(event: PageEvent): void {
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;

    this.pageIndex = pageIndex; // Actualizar el índice de la página
    this.pageSize = pageSize;   // Actualizar el tamaño de la página

    // Llamar a la función para cargar la página correspondiente
    this.loadAcudientes(pageIndex, pageSize);
  }
  filtrarAcudientes(event: any) {
    const filtro = event.target.value;
    this.acudienteService.getAcudientes(0, 10, filtro).subscribe(data => {
      this.acudientes = data.content;
    });
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    const filteredData = this.acudientes.filter(acudiente => {
      if (this.filterType === 'nombre') {
        return acudiente.nombres.toLowerCase().includes(filterValue);
      } else if (this.filterType === 'documento') {
        return acudiente.documentoIdentidad.toLowerCase().includes(filterValue);
      }
      return true; // Si no hay filtro, mostrar todos
    });
  
    this.dataSource.data = filteredData; // Aquí actualizas el dataSource
  }
}  