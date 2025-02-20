import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Acudiente } from 'src/app/models/entity/Acudiente.interface';
import { AcudienteService } from 'src/app/services/acudiente/acudiente.service';

@Component({
  selector: 'app-matricular-acudiente-dialog',
  templateUrl: './matricular-acudiente-dialog.component.html',
  styleUrls: ['./matricular-acudiente-dialog.component.scss']
})
export class MatricularAcudienteDialogComponent implements OnInit {
  selectedAcudiente: Acudiente | null = null;
  searchTerm: string = '';
  acudientes: Acudiente[] = [];
  filteredAcudientes: Acudiente[] = [];
  totalElements: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  dataSource = new MatTableDataSource<Acudiente>([]);
  filterType: string = 'nombre';
  totalPages: number = 0;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<MatricularAcudienteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { acudientes: Acudiente[] },
    private acudienteService: AcudienteService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAcudientes(0, 5);
    this.acudientes = this.data.acudientes;
    this.totalElements = this.acudientes.length;
    this.dataSource.data = this.acudientes;
  }

  selectAcudiente(acudiente: Acudiente): void {
    this.selectedAcudiente = acudiente;
  }

  metodoabsorver(event: PageEvent): void {
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;

    this.pageIndex = pageIndex;
    this.pageSize = pageSize;

    this.loadAcudientes(pageIndex, pageSize);
  }

  onSearchChange(): void {
    this.loadAcudientes(this.pageIndex, this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAcudientes(this.pageIndex, this.pageSize);
  }

  loadAcudientes(page: number, size: number): void {
    this.acudienteService.getAcudientes(page, size).subscribe(
      (data: any) => {
        this.acudientes = data.content;
        this.totalElements = data.totalElements;
        this.totalPages = data.totalPages;
        this.dataSource.data = this.acudientes;

        if (this.paginator) {
          this.paginator.pageIndex = page;
          this.paginator.pageSize = size;
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmSelection(): void {
    this.dialogRef.close(this.selectedAcudiente);
  }

  applyFilter(): void {
    const filtered = this.acudientes.filter(acudiente =>
      acudiente.nombres.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      acudiente.apellidos.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.filteredAcudientes = filtered.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
    this.totalElements = filtered.length;
    this.dataSource.data = this.filteredAcudientes;
  }
}
