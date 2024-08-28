import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { Estudiante } from 'src/app/models/estudiante.model';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-estudiante-detail',
  templateUrl: './estudiante-detail.component.html',
  styleUrls: ['./estudiante-detail.component.scss']
})
export class EstudianteDetailComponent implements OnInit {
  estudiante: Estudiante | undefined;
  edadChart: any;

  constructor(
    private route: ActivatedRoute,
    private estudianteService: EstudianteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.estudianteService.getEstudianteById(+id).subscribe(estudiante => {
        this.estudiante = estudiante;
        if (this.estudiante) {
          const fechaNacimiento = new Date(this.estudiante.fechaNacimiento);
          this.initChart(fechaNacimiento);
        }
      });
    }
  }

  deleteEstudiante(): void {
    if (this.estudiante && this.estudiante.id) {
      this.estudianteService.deleteEstudiante(this.estudiante.id).subscribe(() => {
        this.router.navigate(['/estudiantes']);
      });
    }
  }

  initChart(fechaNacimiento: Date): void {
    if (this.estudiante) {
      const ctx = (document.getElementById('edadChart') as HTMLCanvasElement).getContext('2d');
      this.edadChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Edad'],
          datasets: [{
            label: 'Edad del Estudiante',
            data: [this.calculateAge(fechaNacimiento)],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  calculateAge(dateOfBirth: Date): number {
    const ageDifMs = Date.now() - dateOfBirth.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }
}