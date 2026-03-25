import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { StudentSelectionDialogComponent } from './dialogo/student-selection-dialog.component';
import Chart from 'chart.js/auto';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-weka',
  templateUrl: './weka.component.html',
  styleUrls: ['./weka.component.scss']
})
export class WekaComponent implements OnInit, AfterViewInit {
  @ViewChild('barChart') barChart!: ElementRef<HTMLCanvasElement>;
  studentForm: FormGroup;
  resultado: string = '';
  showForm: boolean = true;
  historial: any[] = [];
  filteredHistorial: any[] = [];
  paginatedHistorial: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  showChart: boolean = false;
  chart: any;

  positiveCount: number = 0;
  negativeCount: number = 0;

  filterResultado: string = '';
  filterDocumento: string = '';

  confidenceVisibility: { [key: number]: boolean } = {};

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog,
    private estudianteService: EstudianteService
  ) {
    this.studentForm = this.fb.group({
      documento: ['', [Validators.required, Validators.pattern('^[0-9]{7,10}$')]],
      edad: ['', [Validators.required, Validators.min(5)]],
      genero: ['', Validators.required],
      horasEstudioSemanal: ['', [Validators.required, Validators.min(0)]],
      asistencia: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      promedioParciales: ['', [Validators.required, Validators.min(0), Validators.max(5)]],
      participacionClases: ['', Validators.required],
      usoPlataformaVirtual: ['', Validators.required],
      antecedentesPerdida: ['', Validators.required],
      apoyoFamiliar: ['', Validators.required],
      cargaAcademica: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      problemasPersonales: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.cargarHistorial();
  }

  ngAfterViewInit() {
    this.createChart();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  openStudentSelectionDialog() {
    const dialogRef = this.dialog.open(StudentSelectionDialogComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: Estudiante) => {
      if (result) {
        this.populateForm(result);
      }
    });
  }

  populateForm(estudiante: Estudiante) {
    const edad = this.calculateAge(estudiante.fechaNacimiento);
    this.studentForm.patchValue({
      documento: estudiante.documentoIdentidad,
      edad: edad,
      genero: estudiante.sexo === 'M' ? 'Masculino' : estudiante.sexo === 'F' ? 'Femenino' : 'Otro',
      horasEstudioSemanal: '',
      asistencia: '',
      promedioParciales: '',
      participacionClases: '',
      usoPlataformaVirtual: '',
      antecedentesPerdida: '',
      apoyoFamiliar: '',
      cargaAcademica: '',
      problemasPersonales: ''
    });
  }

  calculateAge(fechaNacimiento?: Date): number {
    if (!fechaNacimiento) return 0;
    const today = new Date();
    const birthDate = new Date(fechaNacimiento);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  enviarDatos() {
    if (this.studentForm.valid) {
      const datos = this.studentForm.value;
      const headers = this.getHeaders();
      this.http.post('http://localhost:9098/api/predecir', datos, { headers })
        .subscribe({
          next: (response: any) => {
            this.resultado = `Resultado: ${response.prediccion} (Confianza: ${response.confianza})`;
            this.cargarHistorial();
          },
          error: (err) => {
            this.resultado = `Error: ${err.status} - ${err.error?.error || 'Error desconocido'}`;
          }
        });
    } else {
      this.resultado = 'Formulario inválido. Revisa los campos.';
    }
  }

  toggleView(show: boolean) {
    this.showForm = show;
    this.resultado = '';
    if (!this.showForm) {
      this.cargarHistorial();
    }
  }

  toggleChartView() {
    this.showChart = !this.showChart;
    if (this.showChart) {
      this.updateChartData();
      setTimeout(() => this.createChart(), 100);
    } else {
      this.updatePaginatedHistorial();
    }
  }

  cargarHistorial() {
    const headers = this.getHeaders();
    this.http.get('http://localhost:9098/api/historial', { headers })
      .subscribe({
        next: (data: any) => {
          this.historial = data;
          this.applyFilters();
          this.confidenceVisibility = {};
          this.historial.forEach((_, index) => this.confidenceVisibility[index] = false);
        },
        error: (err) => {
          this.resultado = `Error al cargar historial: ${err.message}`;
        }
      });
  }

  applyFilters() {
    this.filteredHistorial = this.historial.filter(item => {
      const resultado = item.perderaAsignatura ? item.perderaAsignatura.toLowerCase().trim() : '';
      const matchesResultado = this.filterResultado === '' || resultado === this.filterResultado;
      const matchesDocumento = this.filterDocumento === '' || 
        (item.documento && item.documento.toString().toLowerCase().includes(this.filterDocumento.toLowerCase()));
      return matchesResultado && matchesDocumento;
    });
    this.totalPages = Math.ceil(this.filteredHistorial.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedHistorial();
    this.updateChartData();
  }

  updatePaginatedHistorial() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedHistorial = this.filteredHistorial.slice(start, end);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedHistorial();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedHistorial();
    }
  }

  updateChartData() {
    this.positiveCount = this.filteredHistorial.filter(item => 
      item.perderaAsignatura?.toLowerCase().trim() === 'tested_positive').length;
    this.negativeCount = this.filteredHistorial.filter(item => 
      item.perderaAsignatura?.toLowerCase().trim() === 'tested_negative').length;
    this.updateChart();
  }

  createChart() {
    if (this.barChart && this.barChart.nativeElement) {
      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = new Chart(this.barChart.nativeElement, {
        type: 'bar',
        data: {
          labels: ['Perderá', 'No Perderá'],
          datasets: [{
            label: 'Predicciones',
            data: [this.positiveCount, this.negativeCount],
            backgroundColor: ['#e57373', '#81c784'],
            borderColor: ['#d32f2f', '#388e3c'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cantidad',
                font: { size: 12 }
              },
              ticks: { font: { size: 10 } }
            },
            x: {
              ticks: { font: { size: 12 } }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
          }
        }
      });
    }
  }

  updateChart() {
    if (this.chart) {
      this.chart.data.datasets[0].data = [this.positiveCount, this.negativeCount];
      this.chart.update();
    }
  }

  getBarHeight(count: number): number {
    const maxHeight = 200; // Altura máxima en píxeles
    const maxCount = Math.max(this.positiveCount, this.negativeCount, 1); // Evitar división por 0
    return (count / maxCount) * maxHeight;
  }

  onFilterResultadoChange(value: string) {
    this.filterResultado = value;
    this.applyFilters();
  }

  onFilterDocumentoChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filterDocumento = input.value;
    this.applyFilters();
  }

  toggleConfidence(index: number) {
    this.confidenceVisibility[index] = !this.confidenceVisibility[index];
  }

  exportToExcel() {
    const exportData = this.historial.map((item, index) => ({
      Documento: item.documento,
      Edad: item.edad,
      Género: item.genero,
      'Horas Estudio': item.horasEstudioSemanal,
      'Asistencia (%)': item.asistencia,
      Promedio: item.promedioParciales,
      Participación: item.participacionClases,
      'Plataforma Virtual': item.usoPlataformaVirtual,
      Antecedentes: item.antecedentesPerdida,
      'Apoyo Familiar': item.apoyoFamiliar,
      'Carga Académica': item.cargaAcademica,
      'Problemas Personales': item.problemasPersonales,
      Resultado: item.perderaAsignatura,
      Confianza: item.confianza
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Predicciones');
    XLSX.writeFile(wb, `Historial_Predicciones_${new Date().toISOString().split('T')[0]}.xlsx`);
  }
}