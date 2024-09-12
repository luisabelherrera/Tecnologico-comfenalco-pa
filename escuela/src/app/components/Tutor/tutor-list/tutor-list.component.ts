import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { tutor } from 'src/app/models/tutor.interface';

import { TutorService } from 'src/app/services/tutor/tutor.service';

@Component({
  selector: 'app-courses-list',
  templateUrl: './tutor-list.component.html',
  styleUrls: ['./tutor-list.component.scss'],
})
export class TutorListComponent  implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nombre', 'apellido', 'telefono', 'email', 'actions'];
  dataSource = new MatTableDataSource<tutor>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private tutorService: TutorService, private router: Router) {}

  ngOnInit(): void {
    this.getTutores();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getTutores(): void {
    this.tutorService.getAllTutores().subscribe(tutores => {
      this.dataSource.data = tutores;
    });
  }

  deleteTutor(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este tutor?')) {
      this.tutorService.deleteTutor(id).subscribe(() => {
        this.getTutores();
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

}