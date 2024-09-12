import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Curso } from 'src/app/models/curso';
import { CursoService } from 'src/app/services/curso/curso.service';

@Component({
  selector: 'app-curso-list',
  templateUrl: './curso-list.component.html',
  styleUrls: ['./curso-list.component.scss']
})
export class CursoListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'horario', 'profesor', 'aula', 'acciones'];
  dataSource = new MatTableDataSource<Curso>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private cursoService: CursoService) { }

  ngOnInit(): void {
    this.loadCursos();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCursos(): void {
    this.cursoService.getAllCursos().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  deleteCurso(id: number): void {
    this.cursoService.deleteCurso(id).subscribe(() => {
      this.loadCursos();
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
