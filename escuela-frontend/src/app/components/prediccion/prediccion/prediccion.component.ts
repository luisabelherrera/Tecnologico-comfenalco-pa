import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DesempenoEstudiante } from 'src/app/models/entity/desempeno-estudiante.model';
import { DesempenoEstudianteService } from 'src/app/services/DesempenoPrediccion/desempeno-estudiante.service';
import { Curso } from 'src/app/models/entity/curso.model';
import { NivelDetalleCurso } from 'src/app/models/entity/NivelDetalleCurso.interface';
import { NivelDetalleCursoService } from 'src/app/services/niveldetallecurso/nivel-detalle-curso.service';
import { CursosService } from 'src/app/services/curso/curso.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Chart from 'chart.js/auto';
import { StudentSearchDialog } from '../dialogo/dialogo-prediccion/dialogo-prediccion.component';

@Component({
  selector: 'app-prediccion',
  templateUrl: './prediccion.component.html',
  styleUrls: ['./prediccion.component.scss']
})
export class PrediccionComponent implements OnInit, AfterViewInit {
  @ViewChild('donutChart') donutChartRef!: ElementRef;
  @ViewChild('barChart') barChartRef!: ElementRef;
  @ViewChild('individualRadarChart') individualRadarChartRef!: ElementRef;

  desempenos: DesempenoEstudiante[] = [];
  cursos: Curso[] = [];
  nivelDetalleCursos: NivelDetalleCurso[] = [];
  selectedCursoId: number | null = null;
  filteredDesempenos: DesempenoEstudiante[] = [];
  prediccionSi: number = 0;
  prediccionNo: number = 0;
  total: number = 0;
  promedioAsistencia: number = 0;
  promedioParciales: number = 0;
  selectedEstudianteId: string = '';
  selectedEstudiante: DesempenoEstudiante | null = null;
  prediccionIndividual: 'Sí' | 'No' | '' = '';
  decisionPath: string[] = [];

  private donutChart: any = null;
  private barChart: any = null;
  private individualRadarChart: any = null;
  loading: boolean = true;

  constructor(
    private service: DesempenoEstudianteService,
    private cursosService: CursosService,
    private nivelDetalleCursoService: NivelDetalleCursoService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCursos();
    this.loadNivelDetalleCursos();
    this.loadDesempenos();
  }

  ngAfterViewInit(): void {}

  loadCursos(): void {
    this.cursosService.getCursos().subscribe({
      next: (cursos) => {
        this.cursos = cursos;
        console.log('Cursos cargados:', this.cursos);
      },
      error: (err) => console.error('Error al cargar cursos:', err)
    });
  }

  loadNivelDetalleCursos(): void {
    this.nivelDetalleCursoService.getAll().subscribe({
      next: (nivelDetalleCursos) => {
        this.nivelDetalleCursos = nivelDetalleCursos;
        console.log('NivelDetalleCursos cargados:', this.nivelDetalleCursos);
      },
      error: (err) => console.error('Error al cargar nivel detalle cursos:', err)
    });
  }

  loadDesempenos(): void {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data) => {
        this.desempenos = data;
        console.log('Desempeños cargados:', this.desempenos);
        console.log('Estudiantes en desempeños:', this.desempenos.map(d => ({
          idEstudiante: d.estudiante.idEstudiante,
          nombre: `${d.estudiante.nombres} ${d.estudiante.apellidos || ''}`,
          nivelDetalleId: d.inscripcion?.nivelDetalle?.idNivelDetalle,
          edad: this.calcularEdad(d.estudiante.fechaNacimiento),
          sexo: d.estudiante.sexo
        })));
        this.filterDesempenosByCurso();
        this.applyPredictionLogic(this.filteredDesempenos);
        this.updateStatsFromData(this.filteredDesempenos);
        this.initializeCharts();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar desempeños:', err);
        this.loading = false;
      }
    });
  }

  refreshData(): void {
    console.log('Recargando datos...');
    this.loadCursos();
    this.loadNivelDetalleCursos();
    this.loadDesempenos();
  }

  filterDesempenosByCurso(): void {
    if (this.selectedCursoId && this.nivelDetalleCursos.length > 0) {
      const relevantNivelDetalleIds = this.nivelDetalleCursos
        .filter(ndc => ndc.curso?.idCurso === this.selectedCursoId && ndc.nivelDetalle)
        .map(ndc => ndc.nivelDetalle!.idNivelDetalle);
      console.log(`Filtrando para curso ID: ${this.selectedCursoId}, NivelDetalle IDs relevantes:`, relevantNivelDetalleIds);

      this.filteredDesempenos = this.desempenos.filter(d => {
        const nivelDetalleId = d.inscripcion?.nivelDetalle?.idNivelDetalle;
        const matches = nivelDetalleId && relevantNivelDetalleIds.includes(nivelDetalleId);
        console.log(`Estudiante ${d.estudiante.nombres} ${d.estudiante.apellidos || ''} (ID: ${d.estudiante.idEstudiante}):`, {
          nivelDetalleId: nivelDetalleId,
          matches: matches,
          inscripcion: d.inscripcion
        });
        return matches;
      });
      console.log('Desempeños filtrados:', this.filteredDesempenos);
    } else {
      this.filteredDesempenos = [...this.desempenos];
      console.log('Sin curso seleccionado, mostrando todos los desempeños:', this.filteredDesempenos);
    }
    this.applyPredictionLogic(this.filteredDesempenos);
    this.updateStatsFromData(this.filteredDesempenos);
    this.initializeCharts();
  }

  onCursoChange(): void {
    console.log('Curso seleccionado cambiado a:', this.selectedCursoId);
    this.filterDesempenosByCurso();
    this.selectedEstudianteId = '';
    this.selectedEstudiante = null;
    this.prediccionIndividual = '';
    this.decisionPath = [];
  }

  openStudentSearchDialog(): void {
    console.log('Abriendo diálogo con desempeños filtrados:', this.filteredDesempenos);
    const dialogRef = this.dialog.open(StudentSearchDialog, {
      width: '500px',
      data: { 
        desempenos: this.filteredDesempenos,
        nivelDetalleCursos: this.nivelDetalleCursos
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedEstudianteId = result;
        this.calcularPrediccionIndividual();
        this.initIndividualRadarChart();
      }
    });
  }

  private applyPredictionLogic(data: DesempenoEstudiante[]): void {
    this.prediccionSi = data.filter(d => this.predictIndividualWithPath(d).prediction).length;
    this.prediccionNo = data.length - this.prediccionSi;
    this.total = this.prediccionSi + this.prediccionNo;
  }

  private updateStatsFromData(data: DesempenoEstudiante[]): void {
    this.promedioAsistencia = data.length > 0 
      ? data.reduce((sum, d) => sum + d.asistencia, 0) / data.length 
      : 0;
    this.promedioParciales = data.length > 0 
      ? data.reduce((sum, d) => sum + d.promedioParciales, 0) / data.length 
      : 0;
  }

  calcularPrediccionIndividual(): void {
    if (!this.selectedEstudianteId || isNaN(+this.selectedEstudianteId)) {
      this.selectedEstudiante = null;
      this.prediccionIndividual = '';
      this.decisionPath = [];
      return;
    }

    this.selectedEstudiante = this.filteredDesempenos.find(d => d.idDesempeno === +this.selectedEstudianteId) || null;
    if (this.selectedEstudiante) {
      const result = this.predictIndividualWithPath(this.selectedEstudiante);
      this.prediccionIndividual = result.prediction ? 'Sí' : 'No';
      this.decisionPath = result.path;
    } else {
      this.prediccionIndividual = '';
      this.decisionPath = [];
    }
  }

  predictIndividualWithPath(d: DesempenoEstudiante): { prediction: boolean; path: string[] } {
    const path: string[] = [];
    if (d.asistencia <= 60) {
      path.push('Asistencia <= 60%');
      if (d.promedioParciales <= 3.0) {
        path.push('Promedio Parciales <= 3.0');
        if (d.participacionClases === 'Baja') {
          path.push('Participación = Baja');
          if (d.antecedentesPerdida === 'Sí') {
            path.push('Antecedentes = Sí');
            return { prediction: true, path };
          } else {
            path.push('Antecedentes = No');
            return { prediction: false, path };
          }
        } else {
          path.push('Participación > Baja');
          return { prediction: false, path };
        }
      } else {
        path.push('Promedio Parciales > 3.0');
        return { prediction: false, path };
      }
    } else {
      path.push('Asistencia > 60%');
      if (d.promedioParciales <= 2.5) {
        path.push('Promedio Parciales <= 2.5');
        return { prediction: true, path };
      } else {
        path.push('Promedio Parciales > 2.5');
        return { prediction: false, path };
      }
    }
  }

  getPorcentajeSi(): number {
    return this.total > 0 ? (this.prediccionSi / this.total) * 100 : 0;
  }

  getPorcentajeNo(): number {
    return this.total > 0 ? (this.prediccionNo / this.total) * 100 : 0;
  }

  calcularEdad(fechaNacimiento?: Date): number | null {
    if (!fechaNacimiento) return null;
    const birthDate = new Date(fechaNacimiento);
    if (isNaN(birthDate.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  mapSexoToGenero(sexo?: string): 'Masculino' | 'Femenino' | 'Otro' {
    switch (sexo?.toLowerCase()) {
      case 'masculino':
        return 'Masculino';
      case 'femenino':
        return 'Femenino';
      default:
        return 'Otro';
    }
  }

  private initializeCharts(): void {
    setTimeout(() => {
      this.initDonutChart();
      this.initBarChart();
      if (this.selectedEstudiante) {
        this.initIndividualRadarChart();
      }
    }, 0);
  }

  private initDonutChart(): void {
    if (!this.donutChartRef) return;
    const ctx = this.donutChartRef.nativeElement.getContext('2d');
    if (this.donutChart) this.donutChart.destroy();

    this.donutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['En Riesgo', 'Sin Riesgo'],
        datasets: [{
          data: [this.prediccionSi, this.prediccionNo],
          backgroundColor: ['#ff6384', '#36a2eb'],
          borderColor: ['#fff', '#fff'],
          borderWidth: 2,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw;
                const total = context.dataset.data.reduce((a: any, b: any) => Number(a) + Number(b), 0);
                const percentage = Math.round((Number(value) / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  private initBarChart(): void {
    if (!this.barChartRef) return;
    const ctx = this.barChartRef.nativeElement.getContext('2d');
    if (this.barChart) this.barChart.destroy();

    const attendanceRanges = [
      { label: '<60%', count: 0 },
      { label: '60-70%', count: 0 },
      { label: '70-80%', count: 0 },
      { label: '80-90%', count: 0 },
      { label: '90-100%', count: 0 }
    ];

    const gradeRanges = [
      { label: '<2.0', count: 0 },
      { label: '2.0-3.0', count: 0 },
      { label: '3.0-4.0', count: 0 },
      { label: '4.0-5.0', count: 0 }
    ];

    this.filteredDesempenos.forEach(d => {
      if (d.asistencia < 60) attendanceRanges[0].count++;
      else if (d.asistencia < 70) attendanceRanges[1].count++;
      else if (d.asistencia < 80) attendanceRanges[2].count++;
      else if (d.asistencia < 90) attendanceRanges[3].count++;
      else attendanceRanges[4].count++;

      if (d.promedioParciales < 2.0) gradeRanges[0].count++;
      else if (d.promedioParciales < 3.0) gradeRanges[1].count++;
      else if (d.promedioParciales < 4.0) gradeRanges[2].count++;
      else gradeRanges[3].count++;
    });

    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Asistencia', 'Calificaciones'],
        datasets: [
          { label: attendanceRanges[0].label, data: [attendanceRanges[0].count, 0], backgroundColor: '#ff6384', stack: 'Stack 0' },
          { label: attendanceRanges[1].label, data: [attendanceRanges[1].count, 0], backgroundColor: '#ff9f40', stack: 'Stack 0' },
          { label: attendanceRanges[2].label, data: [attendanceRanges[2].count, 0], backgroundColor: '#ffcd56', stack: 'Stack 0' },
          { label: attendanceRanges[3].label, data: [attendanceRanges[3].count, 0], backgroundColor: '#4bc0c0', stack: 'Stack 0' },
          { label: attendanceRanges[4].label, data: [attendanceRanges[4].count, 0], backgroundColor: '#36a2eb', stack: 'Stack 0' },
          { label: gradeRanges[0].label, data: [0, gradeRanges[0].count], backgroundColor: '#ff6384', stack: 'Stack 1' },
          { label: gradeRanges[1].label, data: [0, gradeRanges[1].count], backgroundColor: '#ff9f40', stack: 'Stack 1' },
          { label: gradeRanges[2].label, data: [0, gradeRanges[2].count], backgroundColor: '#4bc0c0', stack: 'Stack 1' },
          { label: gradeRanges[3].label, data: [0, gradeRanges[3].count], backgroundColor: '#36a2eb', stack: 'Stack 1' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true }
        },
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  private initIndividualRadarChart(): void {
    if (!this.individualRadarChartRef || !this.selectedEstudiante) return;
    const ctx = this.individualRadarChartRef.nativeElement.getContext('2d');
    if (this.individualRadarChart) this.individualRadarChart.destroy();

    const avgAsistencia = this.promedioAsistencia;
    const avgParciales = this.promedioParciales;
    const avgHoras = this.filteredDesempenos.reduce((sum, d) => sum + d.horasEstudioSemanal, 0) / this.filteredDesempenos.length || 0;

    this.individualRadarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Asistencia', 'Promedio Parciales', 'Horas Estudio', 'Participación', 'Uso Plataforma'],
        datasets: [
          {
            label: `${this.selectedEstudiante.estudiante.nombres} ${this.selectedEstudiante.estudiante.apellidos || ''}`,
            data: [
              this.selectedEstudiante.asistencia,
              this.selectedEstudiante.promedioParciales * 20,
              this.selectedEstudiante.horasEstudioSemanal * 5,
              this.getParticipationScore(this.selectedEstudiante.participacionClases),
              this.getPlatformScore(this.selectedEstudiante.usoPlataformaVirtual)
            ],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: '#36a2eb',
            pointBackgroundColor: '#36a2eb'
          },
          {
            label: 'Promedio General',
            data: [
              avgAsistencia,
              avgParciales * 20,
              avgHoras * 5,
              50,
              50
            ],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: '#ff6384',
            pointBackgroundColor: '#ff6384'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: { beginAtZero: true, max: 100 }
        }
      }
    });
  }

  private getParticipationScore(participacion: string): number {
    switch (participacion) {
      case 'Alta': return 100;
      case 'Media': return 60;
      case 'Baja': return 20;
      default: return 0;
    }
  }

  private getPlatformScore(uso: string): number {
    switch (uso) {
      case 'Alto': return 100;
      case 'Medio': return 60;
      case 'Bajo': return 20;
      default: return 0;
    }
  }

  exportToExcel(): void {
    const exportData = this.filteredDesempenos.map(d => {
      const result = this.predictIndividualWithPath(d);
      const nivelDetalleCurso = this.nivelDetalleCursos.find(ndc => 
        ndc.nivelDetalle?.idNivelDetalle === d.inscripcion?.nivelDetalle?.idNivelDetalle
      );
      return {
        'ID Desempeno': d.idDesempeno,
        'ID Estudiante': d.estudiante.idEstudiante,
        'Nombres': d.estudiante.nombres,
        'Apellidos': d.estudiante.apellidos || '',
        'Curso': nivelDetalleCurso?.curso?.descripcion || 'N/A',
        'Edad': this.calcularEdad(d.estudiante.fechaNacimiento) || 'N/A',
        'Genero': this.mapSexoToGenero(d.estudiante.sexo),
        'Horas Estudio Semanal': d.horasEstudioSemanal,
        'Asistencia (%)': d.asistencia,
        'Promedio Parciales': d.promedioParciales,
        'Participacion Clases': d.participacionClases,
        'Uso Plataforma Virtual': d.usoPlataformaVirtual,
        'Antecedentes Perdida': d.antecedentesPerdida,
        'Prediccion': result.prediction ? 'Sí' : 'No',
        'Ruta Decision': result.path.join(' -> ')
      };
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = { Sheets: { 'Desempeños': worksheet }, SheetNames: ['Desempeños'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `Desempeno_Estudiantil_${new Date().toISOString().split('T')[0]}.xlsx`);
  }
}