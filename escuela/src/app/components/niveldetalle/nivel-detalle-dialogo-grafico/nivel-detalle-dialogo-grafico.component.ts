import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; // Import MatDialogRef
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-nivel-detalle-dialogo-grafico',
  templateUrl: './nivel-detalle-dialogo-grafico.component.html',
  styleUrls: ['./nivel-detalle-dialogo-grafico.component.scss']
})
export class NivelDetalleDialogoGraficoComponent implements OnInit {
  totalVacantes: number;
  vacantesDisponibles: number;
  vacantesOcupadas: number;
  chart: Chart<'doughnut', number[], string> | undefined; 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<NivelDetalleDialogoGraficoComponent>  
  ) {
    this.totalVacantes = data.totalVacantes;
    this.vacantesDisponibles = data.vacantesDisponibles;
    this.vacantesOcupadas = data.vacantesOcupadas;
  }

  ngOnInit() {
    this.createChart();
  }

  createChart() {
    const ctx = (document.getElementById('vacantesChart') as HTMLCanvasElement).getContext('2d');

    if (ctx) {
      const chartConfig: ChartConfiguration<'doughnut', number[], string> = {
        type: 'doughnut',
        data: {
          labels: ['Vacantes Disponibles', 'Vacantes Ocupadas', 'Vacantes Totales'],
          datasets: [{
            data: [
              this.vacantesDisponibles,
              this.vacantesOcupadas,
              this.totalVacantes - (this.vacantesDisponibles + this.vacantesOcupadas) // Total - (Available + Occupied)
            ],
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
            hoverBackgroundColor: ['#1E90FF', '#FF4500', '#FFD700'],
            borderWidth: 2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          plugins: {
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  return `${tooltipItem.label}: ${tooltipItem.raw}`;
                }
              }
            },
            legend: {
              display: true,
              position: 'bottom',
            },
          }
        }
      };

      this.chart = new Chart(ctx, chartConfig); 
    } else {
      console.error('Error: No se pudo obtener el contexto del canvas');
    }
  }

  close(): void {
    this.dialogRef.close();  
  }
}
