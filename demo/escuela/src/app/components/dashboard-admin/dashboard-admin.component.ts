import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Chart, ChartConfiguration } from 'chart.js';
import { registerables } from 'chart.js';
import * as annotationPlugin from 'chartjs-plugin-annotation'; // Import the annotation plugin
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Calificacion } from 'src/app/models/entity/Calificacion.interface';
import { Inscripcion } from 'src/app/models/entity/Inscripcion.interface';
import { Nivel } from 'src/app/models/entity/nivel.interface';
import { NivelDetalle } from 'src/app/models/entity/NivelDetalle.interface';
import { Periodo } from 'src/app/models/entity/Periodo.interface';
import { CalificacionService } from 'src/app/services/calificacion/calificacion.service';
import { InscripcionService } from 'src/app/services/matricula/matricula.service';
import { NivelService } from 'src/app/services/nivel/Nivel.service';
import { NivelDetalleService } from 'src/app/services/niveldetalle/NivelDetalle.service';
import { PeriodoService } from 'src/app/services/periodo/periodo.service';

// Register Chart.js components and the annotation plugin
Chart.register(...registerables, annotationPlugin);

interface AsignaturaData {
  asignatura: string;
  nivel: string;
  grado: string;
  seccion: string;
  promedio: number;
  estudianteCount: number;
}

interface PieSlice {
  nombre: string;
  valor: number;
  porcentaje: number;
  color: string;
}

interface GradeTrend {
  periodo: number;
  descripcion: string;
  promedio: number;
  predictedAverage?: number;
  confidenceLower?: number;
  confidenceUpper?: number;
  isPredicted?: boolean;
}

interface AIInsightDetail {
  summary: string;
  recommendation?: string;
}

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardAdminComponent implements OnInit, AfterViewInit {
  @ViewChild('gradesChart') gradesChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('enrollmentChart') enrollmentChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('genderChart') genderChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trendChart') trendChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('dashboardContent') dashboardContent!: ElementRef<HTMLDivElement>;

  nivelesDetalles: NivelDetalle[] = [];
  niveles: Nivel[] = [];
  periodos: Periodo[] = [];
  inscripciones: Inscripcion[] = [];
  calificaciones: Calificacion[] = [];

  totalEstudiantes = 0;
  totalInscripciones = 0;
  totalNiveles = 0;
  promedioGeneral = 0;

  selectedPeriodo: number | null = null;
  selectedNivel: number | null = null;
  selectedGrado: string | null = null;

  promediosPorAsignatura: AsignaturaData[] = [];
  estadosInscripcion: PieSlice[] = [];
  distribucionGenero: PieSlice[] = [];
  gradeTrends: GradeTrend[] = [];

  loading = true;
  error: string | null = null;
  isDarkMode = false;
  charts: { [key: string]: Chart } = {};

aiInsights: {
  grades: AIInsightDetail;
  enrollment: AIInsightDetail;
  gender: AIInsightDetail;
  trend: AIInsightDetail;
  prediction: AIInsightDetail;
} = {
  grades: { summary: '', recommendation: '' },
  enrollment: { summary: '', recommendation: '' },
  gender: { summary: '', recommendation: '' },
  trend: { summary: '', recommendation: '' },
  prediction: { summary: '', recommendation: '' },
};
  aiLoading = false;

  private apiKey = 'AIzaSyB9HNN9nYfHK07TlZiCjMG-qVXZ2u70Rxc';
  private url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`;

  constructor(
    private nivelDetalleService: NivelDetalleService,
    private nivelService: NivelService,
    private periodoService: PeriodoService,
    private inscripcionService: InscripcionService,
    private calificacionService: CalificacionService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.updateCharts();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    forkJoin({
      nivelesDetalles: this.nivelDetalleService.getAll().pipe(catchError(() => of([]))),
      niveles: this.nivelService.getAll().pipe(catchError(() => of([]))),
      periodos: this.periodoService.getAll().pipe(catchError(() => of([]))),
      inscripciones: this.inscripcionService.getAllInscripciones().pipe(catchError(() => of([]))),
      calificaciones: this.calificacionService.getCalificaciones().pipe(catchError(() => of([]))),
    }).subscribe({
      next: (results) => {
        this.nivelesDetalles = results.nivelesDetalles;
        this.niveles = results.niveles;
        this.periodos = results.periodos;
        this.inscripciones = results.inscripciones;
        this.calificaciones = results.calificaciones;

        this.calculateStats();
        this.processChartData();
        this.processGradeTrends();
        this.generateAIInsights();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Error al cargar los datos: ' + (err.message || 'Error desconocido');
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  calculateStats(): void {
    const uniqueEstudiantes = new Set(this.inscripciones.map(ins => ins.estudiante.idEstudiante));
    this.totalEstudiantes = uniqueEstudiantes.size;
    this.totalInscripciones = this.inscripciones.length;
    this.totalNiveles = this.niveles.length;
    this.promedioGeneral = this.calificaciones.length
      ? Number((this.calificaciones.reduce((sum, cal) => sum + cal.nota, 0) / this.calificaciones.length).toFixed(1))
      : 0;
  }

  processChartData(): void {
    this.processGradesBySubject();
    this.processEnrollmentStatus();
    this.processGenderDistribution();
  }

  processGradesBySubject(): void {
    const filteredCalificaciones = this.calificaciones.filter(cal => {
      const inscripcion = this.inscripciones.find(ins => ins.estudiante.idEstudiante === cal.estudiante.idEstudiante);
      if (!inscripcion) return false;
      const nivelDetalle = this.nivelesDetalles.find(nd => nd.idNivelDetalle === inscripcion.nivelDetalle.idNivelDetalle);
      if (!nivelDetalle || !nivelDetalle.nivel || !nivelDetalle.nivel.periodo || !nivelDetalle.gradoSeccion) return false;
      return (
        (this.selectedPeriodo ? nivelDetalle.nivel.periodo.idPeriodo === this.selectedPeriodo : true) &&
        (this.selectedNivel ? nivelDetalle.nivel.idNivel === this.selectedNivel : true) &&
        (this.selectedGrado ? nivelDetalle.gradoSeccion.descripcionGrado === this.selectedGrado : true)
      );
    });

    const grouped = new Map<string, { notas: number[]; estudianteIds: Set<number> }>();
    filteredCalificaciones.forEach(cal => {
      const inscripcion = this.inscripciones.find(ins => ins.estudiante.idEstudiante === cal.estudiante.idEstudiante);
      if (!inscripcion) return;
      const nivelDetalle = this.nivelesDetalles.find(nd => nd.idNivelDetalle === inscripcion.nivelDetalle.idNivelDetalle);
      if (!nivelDetalle || !nivelDetalle.nivel || !nivelDetalle.gradoSeccion) return;
      const key = `${cal.curricular.descripcion}-${nivelDetalle.nivel.descripcionNivel}-${nivelDetalle.gradoSeccion.descripcionGrado}-${nivelDetalle.gradoSeccion.descripcionSeccion}`;
      if (!grouped.has(key)) {
        grouped.set(key, { notas: [], estudianteIds: new Set() });
      }
      const group = grouped.get(key)!;
      group.notas.push(cal.nota);
      group.estudianteIds.add(cal.estudiante.idEstudiante);
    });

    this.promediosPorAsignatura = [];
    grouped.forEach((group, key) => {
      const [asignatura, nivel, grado, seccion] = key.split('-');
      const promedio = group.notas.length ? group.notas.reduce((sum, nota) => sum + nota, 0) / group.notas.length : 0;
      if (promedio > 0) {
        this.promediosPorAsignatura.push({
          asignatura,
          nivel,
          grado,
          seccion,
          promedio: Number(promedio.toFixed(1)),
          estudianteCount: group.estudianteIds.size,
        });
      }
    });
  }

  processEnrollmentStatus(): void {
    const filteredInscripciones = this.inscripciones.filter(ins => {
      const nivelDetalle = this.nivelesDetalles.find(nd => nd.idNivelDetalle === ins.nivelDetalle.idNivelDetalle);
      if (!nivelDetalle || !nivelDetalle.nivel || !nivelDetalle.nivel.periodo || !nivelDetalle.gradoSeccion) return false;
      return (
        (this.selectedPeriodo ? nivelDetalle.nivel.periodo.idPeriodo === this.selectedPeriodo : true) &&
        (this.selectedNivel ? nivelDetalle.nivel.idNivel === this.selectedNivel : true) &&
        (this.selectedGrado ? nivelDetalle.gradoSeccion.descripcionGrado === this.selectedGrado : true)
      );
    });

    const estados = new Map<string, number>();
    filteredInscripciones.forEach(ins => {
      const estado = ins.estadoPago;
      estados.set(estado, (estados.get(estado) || 0) + 1);
    });

    const total = filteredInscripciones.length;
    this.estadosInscripcion = [];
    const allStates = ['PAGADO', 'PENDIENTE', 'EN_PROCESO'];
    const colors = ['#f94144', '#f9c74f', '#90be6d'];
    allStates.forEach((state, index) => {
      const valor = estados.get(state) || 0;
      const porcentaje = total ? Number(((valor / total) * 100).toFixed(1)) : 0;
      this.estadosInscripcion.push({ nombre: state, valor, porcentaje, color: colors[index] });
    });
  }

  processGenderDistribution(): void {
    const filteredInscripciones = this.inscripciones.filter(ins => {
      const nivelDetalle = this.nivelesDetalles.find(nd => nd.idNivelDetalle === ins.nivelDetalle.idNivelDetalle);
      if (!nivelDetalle || !nivelDetalle.nivel || !nivelDetalle.nivel.periodo || !nivelDetalle.gradoSeccion) return false;
      return (
        (this.selectedPeriodo ? nivelDetalle.nivel.periodo.idPeriodo === this.selectedPeriodo : true) &&
        (this.selectedNivel ? nivelDetalle.nivel.idNivel === this.selectedNivel : true) &&
        (this.selectedGrado ? nivelDetalle.gradoSeccion.descripcionGrado === this.selectedGrado : true)
      );
    });

    const estudianteIds = new Set<number>(filteredInscripciones.map(ins => ins.estudiante.idEstudiante));
    const filteredEstudiantes = filteredInscripciones
      .map(ins => ins.estudiante)
      .filter(est => estudianteIds.has(est.idEstudiante));

    const masculinos = filteredEstudiantes.filter(est => est.sexo === 'M').length;
    const femeninos = filteredEstudiantes.filter(est => est.sexo === 'F').length;
    const total = filteredEstudiantes.length;

    this.distribucionGenero = [
      { nombre: 'Masculino', valor: masculinos, porcentaje: total ? Number(((masculinos / total) * 100).toFixed(1)) : 0, color: '#277da1' },
      { nombre: 'Femenino', valor: femeninos, porcentaje: total ? Number(((femeninos / total) * 100).toFixed(1)) : 0, color: '#f9c74f' },
    ];
  }

  processGradeTrends(): void {
    const filteredCalificaciones = this.calificaciones.filter(cal => {
      const inscripcion = this.inscripciones.find(ins => ins.estudiante.idEstudiante === cal.estudiante.idEstudiante);
      if (!inscripcion) return false;
      const nivelDetalle = this.nivelesDetalles.find(nd => nd.idNivelDetalle === inscripcion.nivelDetalle.idNivelDetalle);
      if (!nivelDetalle || !nivelDetalle.nivel || !nivelDetalle.nivel.periodo || !nivelDetalle.gradoSeccion) return false;
      return (
        (this.selectedPeriodo ? nivelDetalle.nivel.periodo.idPeriodo === this.selectedPeriodo : true) &&
        (this.selectedNivel ? nivelDetalle.nivel.idNivel === this.selectedNivel : true) &&
        (this.selectedGrado ? nivelDetalle.gradoSeccion.descripcionGrado === this.selectedGrado : true)
      );
    });

    const groupedByPeriodo = new Map<number, { notas: number[]; descripcion: string }>();
    filteredCalificaciones.forEach(cal => {
      const inscripcion = this.inscripciones.find(ins => ins.estudiante.idEstudiante === cal.estudiante.idEstudiante);
      if (!inscripcion) return;
      const nivelDetalle = this.nivelesDetalles.find(nd => nd.idNivelDetalle === inscripcion.nivelDetalle.idNivelDetalle);
      if (!nivelDetalle || !nivelDetalle.nivel || !nivelDetalle.nivel.periodo) return;
      const periodoId = nivelDetalle.nivel.periodo.idPeriodo;
      const periodo = this.periodos.find(p => p.idPeriodo === periodoId);
      if (!periodo) return;
      if (!groupedByPeriodo.has(periodoId)) {
        groupedByPeriodo.set(periodoId, { notas: [], descripcion: periodo.descripcion });
      }
      groupedByPeriodo.get(periodoId)!.notas.push(cal.nota);
    });

    this.gradeTrends = [];
    groupedByPeriodo.forEach((group, periodoId) => {
      const promedio = group.notas.length ? group.notas.reduce((sum, nota) => sum + nota, 0) / group.notas.length : 0;
      this.gradeTrends.push({
        periodo: periodoId,
        descripcion: group.descripcion,
        promedio: Number(promedio.toFixed(1)),
        isPredicted: false,
      });
    });
    this.gradeTrends.sort((a, b) => a.periodo - b.periodo);

    // Generar predicciones para los próximos 2 períodos
    this.generateGradePredictions();
  }

  generateGradePredictions(): void {
    if (this.gradeTrends.length < 2) {
      this.aiInsights.prediction.summary = 'No hay suficientes datos históricos para generar predicciones.';
      return;
    }

    const prompt = `
      Analiza los datos históricos de tendencias de notas: ${JSON.stringify(this.gradeTrends.filter(trend => !trend.isPredicted))}.
      Contexto: Los filtros aplicados son Período=${this.selectedPeriodo || 'Todos'}, Nivel=${this.selectedNivel || 'Todos'}, Grado=${this.selectedGrado || 'Todos'}.
      Tarea: Predecir el promedio de notas para los próximos 2 períodos basándote en los datos históricos y el contexto proporcionado.
      Proporciona:
      1. Un razonamiento paso a paso de cómo llegas a las predicciones (por ejemplo, análisis de tendencias, factores considerados).
      2. Los promedios predichos para los próximos 2 períodos con un rango de confianza (límite inferior y superior) para cada predicción.
      3. Una recomendación específica basada en las predicciones (por ejemplo, áreas de mejora o intervenciones).
      4. Un resumen breve (2-3 oraciones) sobre las predicciones.
      Formato de respuesta esperado:
      Razonamiento: [Paso 1: ...; Paso 2: ...; etc.]
      Predicción Período X: Y (Rango de confianza: [A, B])
      Predicción Período Y: Z (Rango de confianza: [C, D])
      Recomendación: [Texto]
      Resumen: [Texto]
    `;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 2048 } };

    this.http.post<any>(this.url, body, { headers }).pipe(
      catchError(err => {
        console.error('Error calling Gemini API for predictions:', err);
        return of({ candidates: [{ content: { parts: [{ text: 'Error al generar predicciones.' }] } }] });
      }),
    ).subscribe({
      next: (response) => {
        if (response && response.candidates && response.candidates[0] && response.candidates[0].content) {
          const text = response.candidates[0].content.parts[0].text;
          const lines = text.split('\n');
          const reasoning = lines.find(line => line.startsWith('Razonamiento:'))?.replace('Razonamiento: ', '');
          const prediction1 = lines.find(line => line.startsWith('Predicción Período'))?.match(/Predicción Período (\d+): (\d+\.\d+) \(Rango de confianza: \[(\d+\.\d+), (\d+\.\d+)\]\)/);
          const prediction2 = lines[lines.indexOf(lines.find(line => line.startsWith('Predicción Período')) || '') + 1]?.match(/Predicción Período (\d+): (\d+\.\d+) \(Rango de confianza: \[(\d+\.\d+), (\d+\.\d+)\]\)/);
          const recommendation = lines.find(line => line.startsWith('Recomendación:'))?.replace('Recomendación: ', '');
          const summary = lines.find(line => line.startsWith('Resumen:'))?.replace('Resumen: ', '');

          if (prediction1 && prediction2) {
            const lastPeriodo = this.gradeTrends[this.gradeTrends.length - 1].periodo;
            this.gradeTrends.push({
              periodo: lastPeriodo + 1,
              descripcion: `Período ${lastPeriodo + 1} (Predicho)`,
              promedio: 0,
              predictedAverage: Number(prediction1[2]),
              confidenceLower: Number(prediction1[3]),
              confidenceUpper: Number(prediction1[4]),
              isPredicted: true,
            });
            this.gradeTrends.push({
              periodo: lastPeriodo + 2,
              descripcion: `Período ${lastPeriodo + 2} (Predicho)`,
              promedio: 0,
              predictedAverage: Number(prediction2[2]),
              confidenceLower: Number(prediction2[3]),
              confidenceUpper: Number(prediction2[4]),
              isPredicted: true,
            });
            this.aiInsights.prediction = {
              summary: summary || 'No se pudo generar el resumen de predicciones.',
              recommendation: recommendation || 'No se pudo generar una recomendación.',
            };
          } else {
            this.aiInsights.prediction = {
              summary: 'No se pudo parsear las predicciones de la IA.',
              recommendation: '',
            };
          }
        } else {
          this.aiInsights.prediction = {
            summary: 'Error al generar predicciones.',
            recommendation: '',
          };
        }
        this.updateCharts();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error processing prediction response:', err);
        this.aiInsights.prediction = {
          summary: 'Error al generar predicciones.',
          recommendation: '',
        };
        this.cdr.detectChanges();
      },
    });
  }

  private createGeminiPrompt(): string {
    const context = `Contexto: Filtros aplicados - Período=${this.selectedPeriodo || 'Todos'}, Nivel=${this.selectedNivel || 'Todos'}, Grado=${this.selectedGrado || 'Todos'}.`;
    return `
      ${context}
      Analiza los siguientes datos educativos con un enfoque detallado y razonado:

      1. Promedios por Asignatura: ${JSON.stringify(this.promediosPorAsignatura)}
      2. Estado de Inscripciones: ${JSON.stringify(this.estadosInscripcion)}
      3. Distribución por Género: ${JSON.stringify(this.distribucionGenero)}
      4. Tendencias de Notas (Históricas): ${JSON.stringify(this.gradeTrends.filter(trend => !trend.isPredicted))}

      Tarea: Para cada categoría (1-4), realiza lo siguiente:
      - Proporciona un razonamiento paso a paso sobre cómo interpretas los datos (por ejemplo, identifica tendencias, anomalías o patrones).
      - Ofrece un resumen breve (2-3 oraciones) basado en el análisis.
      - Sugiere una recomendación accionable específica para mejorar o actuar sobre los datos (por ejemplo, enfocarse en asignaturas con bajo rendimiento o gestionar pagos pendientes).
      Formato de respuesta esperado para cada categoría (ejemplo para 1):
      Razonamiento: [Paso 1: ...; Paso 2: ...; etc.]
      Resumen: [Texto]
      Recomendación: [Texto]
      Repite este formato para las categorías 2, 3 y 4.
    `;
  }

  generateAIInsights(): void {
    this.aiLoading = true;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { contents: [{ parts: [{ text: this.createGeminiPrompt() }] }], generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 2048 } };

    this.http.post<any>(this.url, body, { headers }).pipe(
      catchError(err => {
        console.error('Error calling Gemini API:', err);
        return of({ candidates: [{ content: { parts: [{ text: 'No se pudieron generar los insights debido a un error en la API.' }] } }] });
      }),
    ).subscribe({
      next: (response) => {
        if (response && response.candidates && response.candidates[0] && response.candidates[0].content) {
          const text = response.candidates[0].content.parts[0].text;
          const sections = text.split('\n\n');
          this.aiInsights = {
            grades: this.parseInsightSection(sections[0] || 'Razonamiento: No hay datos.\nResumen: No se pudo generar el resumen.\nRecomendación: No disponible.'),
            enrollment: this.parseInsightSection(sections[1] || 'Razonamiento: No hay datos.\nResumen: No se pudo generar el resumen.\nRecomendación: No disponible.'),
            gender: this.parseInsightSection(sections[2] || 'Razonamiento: No hay datos.\nResumen: No se pudo generar el resumen.\nRecomendación: No disponible.'),
            trend: this.parseInsightSection(sections[3] || 'Razonamiento: No hay datos.\nResumen: No se pudo generar el resumen.\nRecomendación: No disponible.'),
            prediction: this.aiInsights.prediction,
          };
        } else {
          this.aiInsights = {
            grades: { summary: 'Error al generar el resumen de notas.', recommendation: '' },
            enrollment: { summary: 'Error al generar el resumen de inscripciones.', recommendation: '' },
            gender: { summary: 'Error al generar el resumen de género.', recommendation: '' },
            trend: { summary: 'Error al generar el resumen de tendencias.', recommendation: '' },
            prediction: { summary: 'Error al generar predicciones.', recommendation: '' },
          };
        }
        this.aiLoading = false;
        this.updateCharts();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error processing AI response:', err);
        this.aiInsights = {
          grades: { summary: 'Error al generar el resumen de notas.', recommendation: '' },
          enrollment: { summary: 'Error al generar el resumen de inscripciones.', recommendation: '' },
          gender: { summary: 'Error al generar el resumen de género.', recommendation: '' },
          trend: { summary: 'Error al generar el resumen de tendencias.', recommendation: '' },
          prediction: { summary: 'Error al generar predicciones.', recommendation: '' },
        };
        this.aiLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private parseInsightSection(section: string): AIInsightDetail {
    const lines = section.split('\n');
    return {
      summary: lines.find(line => line.startsWith('Resumen:'))?.replace('Resumen: ', '') || 'No se pudo generar el resumen.',
      recommendation: lines.find(line => line.startsWith('Recomendación:'))?.replace('Recomendación: ', '') || '',
    };
  }

  updateCharts(): void {
    const createChart = (canvas: ElementRef<HTMLCanvasElement> | undefined, config: ChartConfiguration): void => {
      if (!canvas || !canvas.nativeElement) return;
      if (this.charts[canvas.nativeElement.id]) {
        this.charts[canvas.nativeElement.id].destroy();
      }
      const chart = new Chart(canvas.nativeElement, config);
      this.charts[canvas.nativeElement.id] = chart;
    };

    // Gráfico de Notas por Asignatura
    createChart(this.gradesChartCanvas, {
      type: 'bar',
      data: {
        labels: this.promediosPorAsignatura.map(item => `${item.asignatura} (${item.nivel} - ${item.grado} ${item.seccion})`),
        datasets: [{
          label: 'Promedio',
          data: this.promediosPorAsignatura.map(item => item.promedio),
          backgroundColor: 'rgba(249, 65, 68, 0.7)',
          borderColor: '#f94144',
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, max: 5, title: { display: true, text: 'Nota', font: { family: 'Inter', size: 14 } } },
          x: { ticks: { font: { family: 'Inter', size: 12 }, maxRotation: 45, minRotation: 45 } },
        },
        plugins: {
          tooltip: {
            backgroundColor: 'rgba(39, 125, 161, 0.9)',
            titleFont: { family: 'Inter' },
            bodyFont: { family: 'Inter' },
            callbacks: {
              label: (context) => {
                const item = this.promediosPorAsignatura[context.dataIndex];
                return `${item.asignatura}: ${item.promedio} (Estudiantes: ${item.estudianteCount})\n${this.aiInsights.grades.recommendation || ''}`;
              },
            },
          },
          annotation: {
            annotations: this.promediosPorAsignatura.length > 0 ? [{
              type: 'label',
              xValue: 0,
              yValue: 5,
              content: this.aiInsights.grades.summary.split(' ').slice(0, 10).join(' ') + '...', // Limitar longitud para mejor visualización
              backgroundColor: 'rgba(39, 125, 161, 0.7)',
              color: '#fff',
              font: { size: 12 },
              padding: 5,
              borderRadius: 4,
              position: 'start',
            }] : [],
          },
        },
      },
    });

    // Gráfico de Estado de Inscripciones
    createChart(this.enrollmentChartCanvas, {
      type: 'pie',
      data: {
        labels: this.estadosInscripcion.map(slice => slice.nombre),
        datasets: [{
          data: this.estadosInscripcion.map(slice => slice.valor),
          backgroundColor: this.estadosInscripcion.map(slice => slice.color),
          borderColor: '#ffffff',
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { font: { family: 'Inter', size: 12 } } },
          tooltip: {
            backgroundColor: 'rgba(39, 125, 161, 0.9)',
            titleFont: { family: 'Inter' },
            bodyFont: { family: 'Inter' },
            callbacks: {
              label: (context) => {
                const slice = this.estadosInscripcion[context.dataIndex];
                return `${slice.nombre}: ${slice.valor} (${slice.porcentaje}%)\n${this.aiInsights.enrollment.recommendation || ''}`;
              },
            },
          },
          annotation: {
            annotations: this.estadosInscripcion.length > 0 ? [{
              type: 'label',
              xValue: 'center',
              yValue: 'center',
              content: this.aiInsights.enrollment.summary.split(' ').slice(0, 10).join(' ') + '...',
              backgroundColor: 'rgba(39, 125, 161, 0.7)',
              color: '#fff',
              font: { size: 12 },
              padding: 5,
              borderRadius: 4,
            }] : [],
          },
        },
      },
    });

    // Gráfico de Distribución por Género
    createChart(this.genderChartCanvas, {
      type: 'doughnut',
      data: {
        labels: this.distribucionGenero.map(slice => slice.nombre),
        datasets: [{
          data: this.distribucionGenero.map(slice => slice.valor),
          backgroundColor: this.distribucionGenero.map(slice => slice.color),
          borderColor: '#ffffff',
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { font: { family: 'Inter', size: 12 } } },
          tooltip: {
            backgroundColor: 'rgba(39, 125, 161, 0.9)',
            titleFont: { family: 'Inter' },
            bodyFont: { family: 'Inter' },
            callbacks: {
              label: (context) => {
                const slice = this.distribucionGenero[context.dataIndex];
                return `${slice.nombre}: ${slice.valor} (${slice.porcentaje}%)\n${this.aiInsights.gender.recommendation || ''}`;
              },
            },
          },
          annotation: {
            annotations: this.distribucionGenero.length > 0 ? [{
              type: 'label',
              xValue: 'center',
              yValue: 'center',
              content: this.aiInsights.gender.summary.split(' ').slice(0, 10).join(' ') + '...',
              backgroundColor: 'rgba(39, 125, 161, 0.7)',
              color: '#fff',
              font: { size: 12 },
              padding: 5,
              borderRadius: 4,
            }] : [],
          },
        },
      },
    });

    // Gráfico de Tendencias de Notas
    createChart(this.trendChartCanvas, {
      type: 'line',
      data: {
        labels: this.gradeTrends.map(trend => trend.descripcion),
        datasets: [
          {
            label: 'Promedio de Notas',
            data: this.gradeTrends.map(trend => trend.isPredicted ? trend.predictedAverage : trend.promedio),
            borderColor: '#f9c74f',
            backgroundColor: 'rgba(249, 199, 79, 0.2)',
            fill: false,
            tension: 0.4,
            borderDash: (context) => {
              const index = context.dataIndex;
              return this.gradeTrends[index].isPredicted ? [5, 5] : [];
            },
          },
          {
            label: 'Rango de Confianza (Superior)',
            data: this.gradeTrends.map(trend => trend.confidenceUpper || null),
            borderColor: 'rgba(144, 190, 109, 0.5)',
            backgroundColor: 'transparent',
            fill: '-1',
            tension: 0.4,
            borderDash: [5, 5],
            pointRadius: 0,
          },
          {
            label: 'Rango de Confianza (Inferior)',
            data: this.gradeTrends.map(trend => trend.confidenceLower || null),
            borderColor: 'rgba(144, 190, 109, 0.5)',
            backgroundColor: 'rgba(144, 190, 109, 0.1)',
            fill: '0',
            tension: 0.4,
            borderDash: [5, 5],
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, max: 5, title: { display: true, text: 'Nota', font: { family: 'Inter', size: 14 } } },
          x: { ticks: { font: { family: 'Inter', size: 12 } } },
        },
        plugins: {
          tooltip: {
            backgroundColor: 'rgba(39, 125, 161, 0.9)',
            titleFont: { family: 'Inter' },
            bodyFont: { family: 'Inter' },
            callbacks: {
              label: (context) => {
                const trend = this.gradeTrends[context.dataIndex];
                if (trend.isPredicted) {
                  return `Predicción: ${trend.predictedAverage} (Rango: ${trend.confidenceLower} - ${trend.confidenceUpper})\n${this.aiInsights.prediction.recommendation || ''}`;
                }
                return `Promedio: ${trend.promedio}\n${this.aiInsights.trend.recommendation || ''}`;
              },
            },
          },
          annotation: {
            annotations: this.gradeTrends.length > 0 ? [{
              type: 'label',
              xValue: this.gradeTrends.length - 1,
              yValue: 5,
              content: this.aiInsights.trend.summary.split(' ').slice(0, 10).join(' ') + '...',
              backgroundColor: 'rgba(39, 125, 161, 0.7)',
              color: '#fff',
              font: { size: 12 },
              padding: 5,
              borderRadius: 4,
              position: 'end',
            }] : [],
          },
          legend: {
            labels: {
              filter: (legendItem, chartData) => {
                return !legendItem.text.includes('Rango de Confianza');
              },
            },
          },
        },
      },
    });
  }

  applyFilter(): void {
    this.processChartData();
    this.processGradeTrends();
    this.updateCharts();
    this.generateAIInsights();
    this.cdr.detectChanges();
  }

  refreshData(): void {
    this.selectedPeriodo = null;
    this.selectedNivel = null;
    this.selectedGrado = null;
    this.loadData();
  }

  exportPDF(): void {
    const doc = new jsPDF();
    const content = this.dashboardContent.nativeElement;

    html2canvas(content).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      doc.addPage();
      doc.text('Resumen de Insights:', 10, 10);
      doc.text(`Notas por Asignatura: ${this.aiInsights.grades.summary}`, 10, 20);
      doc.text(`Estado de Inscripciones: ${this.aiInsights.enrollment.summary}`, 10, 30);
      doc.text(`Distribución por Género: ${this.aiInsights.gender.summary}`, 10, 40);
      doc.text(`Tendencia de Notas: ${this.aiInsights.trend.summary}`, 10, 50);
      doc.text(`Predicciones: ${this.aiInsights.prediction.summary}`, 10, 60);
      doc.save(`EduPortal_Dashboard_${new Date().toLocaleString()}.pdf`);
    });
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    Object.values(this.charts).forEach(ch => ch.destroy());
  }

  get uniqueGrados(): string[] {
    const grados = this.nivelesDetalles
      .filter(nd => nd.gradoSeccion && nd.gradoSeccion.descripcionGrado)
      .map(nd => nd.gradoSeccion.descripcionGrado);
    return [...new Set(grados)].sort();
  }
}