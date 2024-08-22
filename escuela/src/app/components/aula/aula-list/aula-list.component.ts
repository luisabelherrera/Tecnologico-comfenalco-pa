import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Aula } from 'src/app/models/aula';
import { AulaService } from 'src/app/services/aula/aula.service';

@Component({
  selector: 'app-aula-list',
  templateUrl: './aula-list.component.html',
  styleUrls: ['./aula-list.component.scss']
})
export class AulaListComponent implements OnInit {
  aulas: Aula[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'capacidad', 'ubicacion', 'actions'];

  constructor(private aulaService: AulaService, private router: Router) { }

  ngOnInit(): void {
    this.loadAulas();
  }

  loadAulas(): void {
    this.aulaService.getAulas().subscribe(data => {
      this.aulas = data;
    });
  }

  deleteAula(id: number) {
    this.aulaService.deleteAula(id).subscribe(
      () => this.loadAulas(),
      error => {
        if (error.status === 409) {
          alert('No se puede eliminar el aula porque está siendo usado en asignacion de ula.');
        } else {
          console.error('Error deleting aula', error);
          alert('Error al eliminar el aula.');
        }
      }
    );
  }
}