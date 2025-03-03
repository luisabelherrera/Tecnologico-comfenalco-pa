import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-nivel-detalle-dialogo-grafico',
  templateUrl: './nivel-detalle-dialogo-grafico.component.html',
  styleUrls: ['./nivel-detalle-dialogo-grafico.component.scss']
})
export class NivelDetalleDialogoGraficoComponent implements OnInit, OnDestroy {
  nivelDetalles: any[];
  filteredNivelDetalles: any[];
  uniqueNiveles: string[] = [];
  selectedNivel: string = ''; // Filter by Nivel
  chartLabels: string[] = [];
  disponiblesData: number[] = [];
  ocupadasData: number[] = [];
  totalesData: number[] = [];

  private doughnutChart: Chart<'doughnut', number[], string> | undefined;
  private barChart: Chart<'bar', number[], string> | undefined;
  private pieChart: Chart<'pie', number[], string> | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any[],
    private dialogRef: MatDialogRef<NivelDetalleDialogoGraficoComponent>
  ) {
    this.nivelDetalles = data;
    this.filteredNivelDetalles = data;
  }

  ngOnInit() {
    this.extractUniqueNiveles();
    this.processData();
    this.createCharts();
  }

  ngOnDestroy() {
    if (this.doughnutChart) this.doughnutChart.destroy();
    if (this.barChart) this.barChart.destroy();
    if (this.pieChart) this.pieChart.destroy();
  }

  extractUniqueNiveles() {
    this.uniqueNiveles = [...new Set(this.nivelDetalles.map(nd => nd.nivel.descripcionNivel))];
    this.selectedNivel = this.uniqueNiveles[0] || ''; // Default to first Nivel
  }

  applyNivelFilter() {
    this.filteredNivelDetalles = this.selectedNivel 
      ? this.nivelDetalles.filter(nd => nd.nivel.descripcionNivel === this.selectedNivel)
      : this.nivelDetalles;
    this.processData();
    this.updateCharts();
  }

  processData() {
    this.chartLabels = this.filteredNivelDetalles.map(nd => `${nd.gradoSeccion.descripcionGrado} - ${nd.gradoSeccion.descripcionSeccion}`);
    this.disponiblesData = this.filteredNivelDetalles.map(nd => nd.vacantesDisponibles);
    this.ocupadasData = this.filteredNivelDetalles.map(nd => nd.vacantesOcupadas);
    this.totalesData = this.filteredNivelDetalles.map(nd => nd.totalVacantes);
  }

  createCharts() {
    // Bar Chart
    const barCtx = (document.getElementById('barChart') as HTMLCanvasElement)?.getContext('2d');
    if (barCtx) {
      const barConfig: ChartConfiguration<'bar', number[], string> = {
        type: 'bar',
        data: {
          labels: this.chartLabels,
          datasets: [
            {
              label: 'Vacantes Disponibles',
              data: this.disponiblesData,
              backgroundColor: '#36A2EB',
              hoverBackgroundColor: '#1E90FF',
              borderWidth: 1,
            },
            {
              label: 'Vacantes Ocupadas',
              data: this.ocupadasData,
              backgroundColor: '#FF6384',
              hoverBackgroundColor: '#FF4500',
              borderWidth: 1,
            },
            {
              label: 'Total Vacantes',
              data: this.totalesData,
              backgroundColor: '#FFCE56',
              hoverBackgroundColor: '#FFD700',
              borderWidth: 1,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Número de Vacantes' } }
          },
          plugins: {
            legend: { position: 'bottom' },
            tooltip: { callbacks: { label: (item) => `${item.dataset.label}: ${item.raw}` } }
          }
        }
      };
      this.barChart = new Chart(barCtx, barConfig);
    }

    // Doughnut Chart (Aggregated)
    const doughnutCtx = (document.getElementById('doughnutChart') as HTMLCanvasElement)?.getContext('2d');
    if (doughnutCtx) {
      const aggregatedData = {
        disponibles: this.disponiblesData.reduce((sum, val) => sum + val, 0),
        ocupadas: this.ocupadasData.reduce((sum, val) => sum + val, 0)
      };
      const doughnutConfig: ChartConfiguration<'doughnut', number[], string> = {
        type: 'doughnut',
        data: {
          labels: ['Vacantes Disponibles', 'Vacantes Ocupadas'],
          datasets: [{
            data: [aggregatedData.disponibles, aggregatedData.ocupadas],
            backgroundColor: ['#36A2EB', '#FF6384'],
            hoverBackgroundColor: ['#1E90FF', '#FF4500'],
            borderWidth: 2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: { callbacks: { label: (item) => `${item.label}: ${item.raw}` } }
          }
        }
      };
      this.doughnutChart = new Chart(doughnutCtx, doughnutConfig);
    }

    // Pie Chart
    const pieCtx = (document.getElementById('pieChart') as HTMLCanvasElement)?.getContext('2d');
    if (pieCtx) {
      const pieConfig: ChartConfiguration<'pie', number[], string> = {
        type: 'pie',
        data: {
          labels: this.chartLabels.map(label => `${label} (Total)`),
          datasets: [{
            data: this.totalesData,
            backgroundColor: this.chartLabels.map((_, i) => `#${Math.floor(Math.random()*16777215).toString(16)}`),
            hoverBackgroundColor: this.chartLabels.map((_, i) => `#${Math.floor(Math.random()*16777215).toString(16)}`),
            borderWidth: 2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: { callbacks: { label: (item) => `${item.label}: ${item.raw}` } }
          }
        }
      };
      this.pieChart = new Chart(pieCtx, pieConfig);
    }
  }

  updateCharts() {
    // Update Bar Chart
    if (this.barChart) {
      this.barChart.data.labels = this.chartLabels;
      this.barChart.data.datasets[0].data = this.disponiblesData;
      this.barChart.data.datasets[1].data = this.ocupadasData;
      this.barChart.data.datasets[2].data = this.totalesData;
      this.barChart.update();
    }

    // Update Doughnut Chart
    if (this.doughnutChart) {
      const aggregatedData = {
        disponibles: this.disponiblesData.reduce((sum, val) => sum + val, 0),
        ocupadas: this.ocupadasData.reduce((sum, val) => sum + val, 0)
      };
      this.doughnutChart.data.datasets[0].data = [aggregatedData.disponibles, aggregatedData.ocupadas];
      this.doughnutChart.update();
    }

    // Update Pie Chart
    if (this.pieChart) {
      this.pieChart.data.labels = this.chartLabels.map(label => `${label} (Total)`);
      this.pieChart.data.datasets[0].data = this.totalesData;
      this.pieChart.update();
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}