import { Component, OnInit, Inject, ElementRef, ViewChild, AfterViewInit } from "@angular/core"
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog"
import { HttpClient } from "@angular/common/http"
import { MatSnackBar } from "@angular/material/snack-bar"
import { Curricular } from "src/app/models/entity/curricular.model"
import { CurricularService } from "src/app/services/curricular/curricular.service"
import { Estudiante } from "src/app/models/entity/Estudiante.interface"
import { DesempenoEstudiante } from "src/app/models/entity/desempeno-estudiante.model"
import { EncuestaEstudiante } from "src/app/models/entity/EncuestaEstudiante.interface"
import { DomSanitizer } from "@angular/platform-browser"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { saveAs } from "file-saver"
import { environment } from "src/environments/environment"
import Chart from "chart.js/auto"

interface EstudiantePrediccion {
  estudiante: Estudiante
  prediccion?: string
  confianza?: number
  nota?: number
  showConfidence?: boolean
}

interface DialogData {
  estudiantePrediccion: EstudiantePrediccion
  curriculares?: Curricular[]
  curricularId?: number
}

interface Tema {
  nombre: string
  contenido: string
  id: string
}

interface ChartData {
  id: string
  type: string
  title: string
  data: any
}

@Component({
  selector: "app-material-docente",
  templateUrl: "./material-docente.component.html",
  styleUrls: ["./material-docente.component.scss", "./material-docente-print.scss"],
})
export class MaterialDocenteComponent implements OnInit, AfterViewInit {
  materialForm: FormGroup
  isLoadingReport = false
  temas: Tema[] = []
  temaSeleccionado: Tema | null = null
  curriculares: Curricular[] = []
  selectedCurricular: Curricular | null = null
  isLoadingCurriculares = false
  today: Date = new Date()
  references = `
    <p>Hall, M., Frank, E., Holmes, G., Pfahringer, B., Reutemann, P., & Witten, I. H. (2009). The WEKA data mining software: An update. <i>SIGKDD Explorations Newsletter, 11</i>(1), 10–18. https://doi.org/10.1145/1656274.1656278</p>
    <p>Oxford University Press. (n.d.). Oxford Learner's Dictionaries. Retrieved from https://www.oxfordlearnersdictionaries.com</p>
    <p>Cambridge University Press. (n.d.). English Language Teaching. Retrieved from https://www.cambridge.org/elt</p>
  `

  // Propiedades para gráficos estilo Power BI
  charts: ChartData[] = []
  chartInstances: { [key: string]: Chart } = {}

  // Paleta de colores profesional de Power BI
  powerBIPalette = {
    primary: ["#01B8AA", "#374649", "#FD625E", "#F2C80F", "#5F6B6D", "#8AD4EB", "#FE9666", "#A66999"],
    secondary: ["#89D5C9", "#71787D", "#FEB6B3", "#FCEB9F", "#A7ADAF", "#D1EEF5", "#FED2B3", "#D8C2D7"],
    gradients: {
      blue: {
        start: "rgba(1, 184, 170, 0.8)",
        end: "rgba(1, 184, 170, 0.1)",
      },
      red: {
        start: "rgba(253, 98, 94, 0.8)",
        end: "rgba(253, 98, 94, 0.1)",
      },
      yellow: {
        start: "rgba(242, 200, 15, 0.8)",
        end: "rgba(242, 200, 15, 0.1)",
      },
      green: {
        start: "rgba(56, 178, 73, 0.8)",
        end: "rgba(56, 178, 73, 0.1)",
      },
    },
  }

  @ViewChild("reportContent") reportContent!: ElementRef
  @ViewChild("performanceChart") performanceChartRef!: ElementRef
  @ViewChild("attendanceChart") attendanceChartRef!: ElementRef
  @ViewChild("participationChart") participationChartRef!: ElementRef
  @ViewChild("predictionChart") predictionChartRef!: ElementRef

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private curricularService: CurricularService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<MaterialDocenteComponent>
  ) {
    this.materialForm = this.fb.group({
      material: ["", Validators.required],
      curricular: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCurriculares()
    if (this.data.curricularId) {
      this.loadCurricularById(this.data.curricularId)
    }
    this.validateStudentAge()
    this.prepareChartData()
  }

  ngAfterViewInit(): void {
    // Los gráficos se inicializarán cuando se genere el informe
  }

  prepareChartData(): void {
    const estudiante = this.data.estudiantePrediccion.estudiante
    const desempeno: DesempenoEstudiante | undefined = estudiante.desempeno

    // Preparar datos para gráficos estilo Power BI
    this.charts = [
      {
        id: "performanceChart",
        type: "bar",
        title: "Rendimiento Académico",
        data: {
          labels: ["Promedio Parciales", "Nota Actual", "Nota Mínima Aprobatoria"],
          datasets: [
            {
              label: "Calificación (sobre 5)",
              data: [desempeno?.promedioParciales || 0, this.data.estudiantePrediccion.nota || 0, 3.0],
              backgroundColor: [
                this.powerBIPalette.primary[0],
                this.powerBIPalette.primary[2],
                this.powerBIPalette.primary[3],
              ],
              borderColor: [
                this.adjustColor(this.powerBIPalette.primary[0], -20),
                this.adjustColor(this.powerBIPalette.primary[2], -20),
                this.adjustColor(this.powerBIPalette.primary[3], -20),
              ],
              borderWidth: 1,
              borderRadius: 6,
              barPercentage: 0.7,
              maxBarThickness: 50,
            },
          ],
        },
      },
      {
        id: "attendanceChart",
        type: "doughnut",
        title: "Asistencia",
        data: {
          labels: ["Asistencia", "Ausencia"],
          datasets: [
            {
              data: [desempeno?.asistencia || 0, 100 - (desempeno?.asistencia || 0)],
              backgroundColor: [this.powerBIPalette.primary[0], this.powerBIPalette.secondary[0]],
              borderColor: [
                this.adjustColor(this.powerBIPalette.primary[0], -20),
                this.adjustColor(this.powerBIPalette.secondary[0], -20),
              ],
              borderWidth: 1,
              hoverOffset: 10,
              hoverBorderWidth: 2,
            },
          ],
        },
      },
      {
        id: "participationChart",
        type: "radar",
        title: "Factores de Desempeño",
        data: {
          labels: ["Participación", "Uso Plataforma", "Horas Estudio", "Apoyo Familiar", "Manejo Estrés"],
          datasets: [
            {
              label: "Nivel Actual",
              data: [
                this.participationToNumber(desempeno?.participacionClases),
                this.platformUseToNumber(desempeno?.usoPlataformaVirtual),
                Math.min(((desempeno?.horasEstudioSemanal || 0) / 10) * 5, 5), // Normalizado a 5
                this.supportToNumber(estudiante.encuesta?.apoyoFamiliar),
                5 - this.stressToNumber(estudiante.encuesta?.nivelEstres), // Invertido para que menos estrés sea mejor
              ],
              backgroundColor: "rgba(1, 184, 170, 0.2)",
              borderColor: this.powerBIPalette.primary[0],
              pointBackgroundColor: this.powerBIPalette.primary[0],
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: this.powerBIPalette.primary[0],
              pointRadius: 4,
              pointHoverRadius: 6,
              borderWidth: 2,
            },
            {
              label: "Nivel Óptimo",
              data: [5, 5, 5, 5, 5],
              backgroundColor: "rgba(253, 98, 94, 0.1)",
              borderColor: this.powerBIPalette.primary[2],
              pointBackgroundColor: this.powerBIPalette.primary[2],
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: this.powerBIPalette.primary[2],
              pointRadius: 3,
              pointHoverRadius: 5,
              borderWidth: 1,
              borderDash: [5, 5],
            },
          ],
        },
      },
      {
        id: "predictionChart",
        type: "gauge",
        title: "Predicción de Aprobación",
        data: {
          value:
            this.data.estudiantePrediccion.prediccion === "tested_negative"
              ? (this.data.estudiantePrediccion.confianza || 0.5) * 100
              : 100 - (this.data.estudiantePrediccion.confianza || 0.5) * 100,
          min: 0,
          max: 100,
          label: "Probabilidad de Aprobación (%)",
          threshold: 60, // Umbral para cambiar de color
        },
      },
    ]
  }

  participationToNumber(participation?: string): number {
    switch (participation?.toLowerCase()) {
      case "alta":
        return 5
      case "media":
        return 3
      case "baja":
        return 1
      default:
        return 0
    }
  }

  platformUseToNumber(use?: string): number {
    switch (use?.toLowerCase()) {
      case "frecuente":
        return 5
      case "ocasional":
        return 3
      case "raro":
        return 1
      default:
        return 0
    }
  }

  supportToNumber(support?: string): number {
    switch (support?.toLowerCase()) {
      case "alto":
        return 5
      case "medio":
        return 3
      case "bajo":
        return 1
      default:
        return 0
    }
  }

  stressToNumber(stress?: string): number {
    switch (stress?.toLowerCase()) {
      case "alto":
        return 5
      case "medio":
        return 3
      case "bajo":
        return 1
      default:
        return 0
    }
  }

  adjustColor(hex: string, percent: number): string {
    // Función para ajustar el brillo de un color hex
    let r = parseInt(hex.substring(1, 3), 16)
    let g = parseInt(hex.substring(3, 5), 16)
    let b = parseInt(hex.substring(5, 7), 16)

    r = Math.max(0, Math.min(255, r + percent))
    g = Math.max(0, Math.min(255, g + percent))
    b = Math.max(0, Math.min(255, b + percent))

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
  }

  initializeCharts(): void {
    setTimeout(() => {
      // Destruir gráficos existentes para evitar duplicados
      Object.values(this.chartInstances).forEach((chart) => chart.destroy())
      this.chartInstances = {}

      // Inicializar gráficos estándar
      this.charts.forEach((chartData) => {
        if (chartData.type !== "gauge") {
          // El gauge requiere tratamiento especial
          const canvas = document.getElementById(chartData.id) as HTMLCanvasElement
          if (canvas) {
            const ctx = canvas.getContext("2d")
            if (!ctx) return

            // Configuraciones específicas por tipo de gráfico
            let options: any = {
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                title: {
                  display: true,
                  text: chartData.title,
                  font: {
                    size: 16,
                    weight: "bold",
                    family: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
                  },
                  padding: {
                    top: 10,
                    bottom: 20,
                  },
                  color: "#333",
                },
                legend: {
                  position: "bottom",
                  labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: {
                      family: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
                      size: 11,
                    },
                  },
                },
                tooltip: {
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  titleColor: "#333",
                  bodyColor: "#333",
                  titleFont: {
                    family: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
                    size: 13,
                    weight: "bold",
                  },
                  bodyFont: {
                    family: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
                    size: 12,
                  },
                  borderColor: "#ddd",
                  borderWidth: 1,
                  padding: 12,
                  cornerRadius: 6,
                  displayColors: true,
                  boxWidth: 10,
                  boxHeight: 10,
                  boxPadding: 3,
                  usePointStyle: true,
                },
              },
              animation: {
                duration: 1500,
                easing: "easeOutQuart",
              },
            }

            // Opciones específicas por tipo de gráfico
            if (chartData.type === "bar") {
              options = {
                ...options,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 5,
                    ticks: {
                      stepSize: 1,
                      font: {
                        family: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
                      },
                    },
                    grid: {
                      display: true,
                      color: "rgba(0, 0, 0, 0.05)",
                    },
                    title: {
                      display: true,
                      text: "Calificación",
                      font: {
                        family: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
                        size: 12,
                      },
                    },
                  },
                  x: {
                    ticks: {
                      font: {
                        family: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
                      },
                    },
                    grid: {
                      display: false,
                    },
                  },
                },
              }
            } else if (chartData.type === "doughnut") {
              options = {
                ...options,
                cutout: "70%",
                plugins: {
                  ...options.plugins,
                  tooltip: {
                    ...options.plugins.tooltip,
                    callbacks: {
                      label: (context: any) => ` ${context.label}: ${context.parsed}%`,
                    },
                  },
                },
              }
            } else if (chartData.type === "radar") {
              options = {
                ...options,
                scales: {
                  r: {
                    beginAtZero: true,
                    min: 0,
                    max: 5,
                    ticks: {
                      stepSize: 1,
                      backdropColor: "rgba(255, 255, 255, 0.8)",
                      font: {
                        family: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
                        size: 10,
                      },
                    },
                    pointLabels: {
                      font: {
                        family: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
                        size: 11,
                        weight: "bold",
                      },
                    },
                    grid: {
                      color: "rgba(0, 0, 0, 0.1)",
                    },
                    angleLines: {
                      color: "rgba(0, 0, 0, 0.1)",
                    },
                  },
                },
              }
            }

            // Crear el gráfico con las opciones mejoradas
            this.chartInstances[chartData.id] = new Chart(ctx, {
              type: chartData.type as any,
              data: chartData.data,
              options: options,
            })
          }
        } else {
          // Inicializar gráfico de gauge (medidor) mejorado
          this.initializeGaugeChart(chartData)
        }
      })
    }, 500) // Pequeño retraso para asegurar que el DOM esté listo
  }

  initializeGaugeChart(chartData: ChartData): void {
    const canvas = document.getElementById(chartData.id) as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Asegurar que el canvas tenga un tamaño adecuado
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const value = chartData.data.value
    const min = chartData.data.min
    const max = chartData.data.max
    const threshold = chartData.data.threshold || 60

    // Configuración del gauge
    const centerX = canvas.width / 2
    const centerY = canvas.height * 0.65 // Posición más abajo para mostrar el arco
    const radius = Math.min(centerX, centerY) * 0.8
    const startAngle = Math.PI
    const endAngle = 0
    const arcWidth = radius * 0.2 // Ancho del arco

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Dibujar el título
    ctx.font = "bold 16px 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif"
    ctx.fillStyle = "#333"
    ctx.textAlign = "center"
    ctx.fillText(chartData.title, centerX, 25)

    // Dibujar el arco de fondo con gradiente
    const bgGradient = ctx.createLinearGradient(0, centerY - radius, 0, centerY + radius)
    bgGradient.addColorStop(0, "#f5f5f5")
    bgGradient.addColorStop(1, "#e0e0e0")

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, false)
    ctx.lineWidth = arcWidth
    ctx.strokeStyle = bgGradient
    ctx.stroke()

    // Calcular el ángulo para el valor actual
    const valueAngle = startAngle - ((value - min) / (max - min)) * (startAngle - endAngle)

    // Crear gradiente para el arco de valor
    let valueGradient
    if (value < threshold) {
      // Gradiente naranja-rojo para valores bajos
      valueGradient = ctx.createLinearGradient(0, centerY - radius, 0, centerY + radius)
      valueGradient.addColorStop(0, "#FD625E") // Rojo
      valueGradient.addColorStop(1, "#F2C80F") // Amarillo
    } else {
      // Gradiente verde para valores altos
      valueGradient = ctx.createLinearGradient(0, centerY - radius, 0, centerY + radius)
      valueGradient.addColorStop(0, "#01B8AA") // Verde azulado
      valueGradient.addColorStop(1, "#89D5C9") // Verde claro
    }

    // Dibujar el arco de valor con sombra
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)"
    ctx.shadowBlur = 5
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 2

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, valueAngle, true)
    ctx.lineWidth = arcWidth
    ctx.lineCap = "round"
    ctx.strokeStyle = valueGradient
    ctx.stroke()

    // Quitar sombra para el resto de elementos
    ctx.shadowColor = "transparent"
    ctx.shadowBlur = 0
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0

    // Dibujar el valor en el centro con estilo mejorado
    ctx.font = "bold 28px 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif"
    ctx.fillStyle = value < threshold ? "#FD625E" : "#01B8AA"
    ctx.textAlign = "center"
    ctx.fillText(`${Math.round(value)}%`, centerX, centerY - 10)

    // Dibujar la etiqueta con estilo mejorado
    ctx.font = "14px 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif"
    ctx.fillStyle = "#666"
    ctx.fillText(chartData.data.label, centerX, centerY + 20)

    // Dibujar las marcas de escala con estilo mejorado
    ctx.font = "12px 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif"
    ctx.fillStyle = "#999"

    // Marca de 0%
    ctx.textAlign = "left"
    ctx.fillText("0%", centerX - radius - 15, centerY + 5)

    // Marca de 100%
    ctx.textAlign = "right"
    ctx.fillText("100%", centerX + radius + 15, centerY + 5)

    // Marca de 50%
    ctx.textAlign = "center"
    ctx.fillText("50%", centerX, centerY + radius + 15)

    // Dibujar líneas de umbral
    ctx.beginPath()
    const thresholdAngle = startAngle - ((threshold - min) / (max - min)) * (startAngle - endAngle)
    const innerRadius = radius - arcWidth / 2
    const outerRadius = radius + arcWidth / 2

    // Línea de umbral
    ctx.moveTo(centerX + innerRadius * Math.cos(thresholdAngle), centerY + innerRadius * Math.sin(thresholdAngle))
    ctx.lineTo(centerX + outerRadius * Math.cos(thresholdAngle), centerY + outerRadius * Math.sin(thresholdAngle))
    ctx.lineWidth = 2
    ctx.strokeStyle = "#333"
    ctx.stroke()

    // Etiqueta de umbral
    ctx.font = "11px 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif"
    ctx.fillStyle = "#333"
    ctx.textAlign = "center"
    const labelRadius = radius + 25
    ctx.fillText(
      "Umbral",
      centerX + labelRadius * Math.cos(thresholdAngle),
      centerY + labelRadius * Math.sin(thresholdAngle),
    )
  }

  validateStudentAge(): void {
    const studentName = `${this.data.estudiantePrediccion.estudiante.nombres} ${this.data.estudiantePrediccion.estudiante.apellidos}`
    this.snackBar.open(
      `¡Bienvenido(a), ${studentName}! Grok, powered by Gemini and Weka 3.8.6, te da la bienvenida al sistema. ¡Listo para aprender y explorar! 🚀`,
      "Cerrar",
      { duration: 5000 },
    )
  }

  loadCurriculares(): void {
    this.isLoadingCurriculares = true
    if (this.data.curriculares && this.data.curriculares.length > 0) {
      this.curriculares = this.data.curriculares
      this.isLoadingCurriculares = false
      if (this.data.curricularId) {
        const preSelectedCurricular = this.curriculares.find((c) => c.idCurricular === this.data.curricularId)
        if (preSelectedCurricular) {
          this.selectedCurricular = preSelectedCurricular
          this.materialForm.patchValue({ curricular: preSelectedCurricular })
        }
      }
    } else {
      this.isLoadingCurriculares = false
      this.snackBar.open("No se encontraron asignaturas asignadas al docente.", "Cerrar", { duration: 5000 })
    }
  }

  loadCurricularById(id: number): void {
    if (!this.curriculares.some((c) => c.idCurricular === id)) {
      this.curricularService.getCurricularById(id).subscribe({
        next: (curricular) => {
          this.curriculares.push(curricular)
          this.selectedCurricular = curricular
          this.materialForm.patchValue({ curricular: curricular })
        },
        error: (error) => {
          this.snackBar.open("Error al cargar la asignatura seleccionada.", "Cerrar", { duration: 3000 })
        },
      })
    }
  }

  generateEvaluativeReport(): void {
    if (!this.selectedCurricular) {
      this.snackBar.open("Selecciona una asignatura antes de generar el informe.", "Cerrar", { duration: 3000 })
      return
    }

    this.isLoadingReport = true
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${environment.geminiApiKey}`
    const estudiante = this.data.estudiantePrediccion.estudiante
    const desempeno: DesempenoEstudiante | undefined = estudiante.desempeno
    const encuesta: EncuestaEstudiante | undefined = estudiante.encuesta

    const prompt = `
Eres un asistente académico experto en generar informes evaluativos para docentes en un colegio, siguiendo las normas APA 7. Genera un informe evaluativo detallado en español para el estudiante ${
      estudiante.nombres || "Nombre no disponible"
    } ${estudiante.apellidos || ""}, que cursa la asignatura "${this.selectedCurricular.descripcion}" en el nivel "${
      this.selectedCurricular.docenteNivelDetalleCurso?.nivelDetalleCurso.nivelDetalle.nivel.descripcionNivel ||
      this.selectedCurricular.descripcion
    }". El informe debe tener exactamente 3 páginas de contenido (750-1000 palabras, Arial 12, doble espacio, márgenes de 1 pulgada, en papel A4), excluyendo portada y referencias, y estar estructurado en secciones claras con títulos en formato "## Título de la Sección". Usa markdown limpio y consistente, evitando énfasis innecesario (e.g., **texto** sin motivo), numeración manual (e.g., "4.2"), o saltos de página dentro del contenido. Coloca "Página X de 3" al final de cada página, sin repetir "INFORME EVALUATIVO" o números adicionales.

**Datos académicos del estudiante:**
- Predicción académica (Weka): "${this.data.estudiantePrediccion.prediccion || "desconocida"}" (tested_positive indica riesgo de reprobar, tested_negative indica probabilidad de aprobar)
- Confianza de la predicción: ${this.data.estudiantePrediccion.confianza !== undefined ? this.data.estudiantePrediccion.confianza * 100 : "no disponible"}%
- Calificación actual: ${this.data.estudiantePrediccion.nota ?? "no disponible"} sobre 5
- Horas de estudio semanal: ${desempeno?.horasEstudioSemanal ?? "no disponible"} horas
- Asistencia: ${desempeno?.asistencia ?? "no disponible"}%
- Promedio de parciales: ${desempeno?.promedioParciales ?? "no disponible"} sobre 5
- Participación en clases: ${desempeno?.participacionClases ?? "no disponible"}
- Uso de plataforma virtual: ${desempeno?.usoPlataformaVirtual ?? "no disponible"}
- Antecedentes de pérdida de asignatura: ${desempeno?.antecedentesPerdida ?? "no disponible"}
- Predicción de pérdida de asignatura: ${desempeno?.perderaAsignatura ?? "no disponible"}

**Datos personales y socioeconómicos:**
- Documento: ${estudiante.documentoIdentidad ?? "no disponible"}
- Edad: ${this.calculateAge(estudiante.fechaNacimiento) || "no disponible"} años
- Género: ${estudiante.sexo === "M" ? "Masculino" : estudiante.sexo === "F" ? "Femenino" : "No especificado"}
- Problemas personales: ${encuesta?.problemasPersonales ?? "no disponible"}
- Apoyo familiar: ${encuesta?.apoyoFamiliar ?? "no disponible"}
- Nivel de estrés: ${encuesta?.nivelEstres ?? "no disponible"}
- Estrato socioeconómico: ${encuesta?.estrato ?? "no disponible"}
- Acceso a internet: ${encuesta?.tieneAccesoInternet ? "Sí" : "No"}
- Posee computador: ${encuesta?.tieneComputador ? "Sí" : "No"}
- Vive con padres: ${encuesta?.viveConPadres ? "Sí" : "No"}
- Tiene trabajo: ${encuesta?.tieneTrabajo ? "Sí" : "No"}

**Análisis Weka:**
- **Metodología**: La predicción se realizó con un clasificador Weka (J48 decision tree, según Hall et al., 2009), entrenado con un conjunto de datos que incluye 13 atributos: documento, ID estudiante, edad, género, horas de estudio semanal, asistencia, promedio de parciales, participación en clases, uso de plataforma virtual, antecedentes de pérdida, apoyo familiar, carga académica, y problemas personales. La clase objetivo es "perderaAsignatura" (tested_positive o tested_negative).
- **Atributos utilizados**: ${[
      `Edad: ${this.calculateAge(estudiante.fechaNacimiento) || "no disponible"} años`,
      `Género: ${estudiante.sexo === "M" ? "Masculino" : estudiante.sexo === "F" ? "Femenino" : "No especificado"}`,
      `Horas de estudio: ${desempeno?.horasEstudioSemanal ?? "no disponible"} horas`,
      `Asistencia: ${desempeno?.asistencia ?? "no disponible"}%`,
      `Promedio de parciales: ${desempeno?.promedioParciales ?? "no disponible"}/5`,
      `Participación: ${desempeno?.participacionClases ?? "no disponible"}`,
      `Plataforma virtual: ${desempeno?.usoPlataformaVirtual ?? "no disponible"}`,
      `Antecedentes: ${desempeno?.antecedentesPerdida ?? "no disponible"}`,
      `Apoyo familiar: ${encuesta?.apoyoFamiliar ?? "no disponible"}`,
      `Problemas personales: ${encuesta?.problemasPersonales ?? "no disponible"}`,
    ].join("; ")}
- **Confianza**: La probabilidad de la predicción (${this.data.estudiantePrediccion.confianza !== undefined ? this.data.estudiantePrediccion.confianza * 100 : "no disponible"}%) refleja la certeza del modelo basada en la distribución de probabilidades para la clase predicha.

**Requisitos del informe:**
1. **Introducción (0.5 página)**: Explica el propósito del informe, el contexto académico (asignatura, nivel), y un resumen del perfil del estudiante (nombre, predicción Weka, calificación, situación personal). Cita el análisis Weka (Hall et al., 2009). Termina con "Página 1 de 3".
2. **Perfil del Estudiante (0.5 página)**: Describe edad, género, nivel educativo, fortalezas (e.g., alta participación), y áreas de oportunidad (e.g., baja asistencia, problemas personales). Termina with "Página 1 de 3".
3. **Análisis de Desempeño (1 página)**: Evalúa el rendimiento en la asignatura:
   - Para 'tested_positive', asistencia < 60%, o promedio < 3.0, detalla dificultades específicas (e.g., fundamentos de programación en Informática).
   - Para 'tested_negative' o participación 'Alta', destaca logros y desafíos avanzados.
   - Integra factores Weka (e.g., horas de estudio, apoyo familiar) y ejemplos específicos.
   - Termina with "Página 2 de 3".
4. **Recomendaciones para la Mejora (0.75 página)**:
   - Propón exactamente 3 estrategias específicas (e.g., tutorías, ejercicios, manejo del estrés, evitando énfasis innecesario como "**estrés**").
   - Sugiere exactamente 2 recursos educativos (lecturas, sitios web, no videos) with citas APA (e.g., Oxford University Press, n.d.).
   - Incluye un cronograma de 2 semanas with 4 actividades (2 por semana), ajustado al tiempo disponible.
   - Adapta estrategias según Weka ('tested_positive' requiere apoyo básico, 'tested_negative' desafíos avanzados).
   - Considera limitaciones personales (e.g., sin internet, usar materiales impresos).
   - Usa subtítulo "### Recursos Educativos" para los recursos and "### Cronograma" for the schedule.
   - Termina with "Página 3 de 3".
5. **Conclusión (0.25 página)**: Resume puntos clave, enfatiza las recomendaciones, and motiva la colaboración entre estudiante, docente, y familia. Termina with "Página 3 de 3".

**Instrucciones adicionales:**
- Usa un tono profesional, motivador, y claro, dirigido a docentes y padres, comprensible para estudiantes de secundaria.
- Estructura with subtítulos "##" y "###" sin numeración manual (e.g., no "4.2"). Evita bold innecesario.
- Genera 750-1000 palabras, excluyendo portada y referencias.
- NO incluyas enlaces a YouTube or duplicar referencias.
- Usa markdown with título "# Informe Evaluativo" followed by sections and "Página X de 3" at the end of each page.
- Ensure all sections are complete, with no truncation.
`

    this.http.post(geminiUrl, { contents: [{ parts: [{ text: prompt }] }] }).subscribe({
      next: (response: any) => {
        const report = response.candidates?.[0]?.content?.parts?.[0]?.text || "No se pudo generar el informe."
        this.materialForm.patchValue({ material: report })
        this.clasificarTemas(report)
        this.isLoadingReport = false
        this.snackBar.open("Informe evaluativo generado con éxito.", "Cerrar", { duration: 3000 })

        // Inicializar gráficos después de generar el informe
        setTimeout(() => {
          this.initializeCharts()
        }, 500)
      },
      error: (error) => {
        this.materialForm.patchValue({ material: "Error al generar el informe. Intenta de nuevo." })
        this.isLoadingReport = false
        this.snackBar.open("Error al generar el informe.", "Cerrar", { duration: 3000 })
      },
    })
  }

  parseMarkdown(content: string): string {
    const html = content
      // Headers
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      // Unordered lists
      .replace(/^\* (.+)$/gm, "<li>$1</li>")
      .replace(/(<li>.+<\/li>\n?)+/g, "<ul>$&</ul>")
      // Paragraphs and line breaks
      .replace(/\n\n(.+?)(?=\n\n|$)/g, "<p>$1</p>")
      .replace(/\n/g, "<br>")
      // Remove extra breaks after lists
      .replace(/<\/ul>\s*<br>/g, "</ul>")
    return html
  }

  clasificarTemas(material: string): void {
    this.temas = []
    const secciones = material.split("## ").filter((seccion) => seccion.trim())
    let pageCount = 0
    secciones.forEach((seccion, index) => {
      const lineas = seccion.split("\n")
      const nombre = lineas[0].trim()
      let contenido = lineas.slice(1).join("\n").trim()
      // Remove "Página X de 3" from content and track page
      contenido = contenido.replace(/Página \d de \d/, () => {
        pageCount++
        return ""
      })
      contenido = this.parseMarkdown(contenido)
      this.temas.push({ nombre, contenido, id: `tema-${index}` })
    })
    this.temaSeleccionado = this.temas.length > 0 ? this.temas[0] : null
    // Validate expected sections
    const expectedSections = [
      "Introducción",
      "Perfil del Estudiante",
      "Análisis de Desempeño",
      "Recomendaciones para la Mejora",
      "Conclusión",
    ]
    const missingSections = expectedSections.filter(
      (section) => !this.temas.some((tema) => tema.nombre === section),
    )
    if (missingSections.length > 0) {
      this.snackBar.open(
        `Advertencia: Faltan secciones: ${missingSections.join(", ")}. Revisa el informe generado.`,
        "Cerrar",
        { duration: 5000 },
      )
    }
  }

  enviarMaterial(): void {
    if (this.materialForm.valid) {
      this.dialogRef.close({
        material: this.materialForm.value.material,
        curricular: this.selectedCurricular,
      })
    } else {
      this.snackBar.open("Por favor, completa el formulario correctamente.", "Cerrar", { duration: 3000 })
    }
  }

  exportAsPDF(): void {
    if (!this.materialForm.valid || !this.reportContent) {
      this.snackBar.open("Por favor, genera un informe válido antes de exportar.", "Cerrar", { duration: 3000 })
      return
    }

    // Asegurarse de que los gráficos estén actualizados antes de exportar
    this.initializeCharts()

    // Mostrar mensaje de carga
    const loadingSnackBar = this.snackBar.open("Preparando PDF, por favor espere...", "", {
      duration: 0,
    })

    // Pequeño retraso para asegurar que los gráficos se rendericen completamente
    setTimeout(() => {
      const reportElement = this.reportContent.nativeElement
      const fileName = `Informe_${this.data.estudiantePrediccion.estudiante.nombres || "Estudiante"}_${this.selectedCurricular?.descripcion}.pdf`

      reportElement.classList.add("print-mode")

      html2canvas(reportElement, {
        scale: 2, // Mayor resolución
        allowTaint: true,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png")
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
          })

          // Añadir metadatos al PDF para hacerlo más profesional
          pdf.setProperties({
            title: `Informe Evaluativo - ${this.data.estudiantePrediccion.estudiante.nombres || "Estudiante"}`,
            subject: `Informe para ${this.selectedCurricular?.descripcion || "Asignatura"}`,
            author: "Sistema de Evaluación Académica",
            keywords: "informe, evaluación, académico, educación",
            creator: "EduPortal",
          })

          const imgWidth = 190 // 210mm - 2 * 10mm margins
          const pageHeight = 297
          const imgHeight = (canvas.height * imgWidth) / canvas.width
          let heightLeft = imgHeight

          let position = 0

          pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight)
          heightLeft -= pageHeight

          while (heightLeft > 0) {
            position = heightLeft - imgHeight
            pdf.addPage()
            pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight)
            heightLeft -= pageHeight
          }

          pdf.save(fileName)
          loadingSnackBar.dismiss()
          this.snackBar.open("Informe exportado como PDF con éxito.", "Cerrar", { duration: 3000 })
          reportElement.classList.remove("print-mode")
        })
        .catch((error) => {
          console.error("Error al exportar PDF:", error)
          loadingSnackBar.dismiss()
          this.snackBar.open("Error al exportar el informe como PDF.", "Cerrar", { duration: 3000 })
        })
    }, 1500) // Aumentar el tiempo de espera para asegurar que los gráficos se rendericen completamente
  }

  exportAsWord(): void {
    if (!this.materialForm.valid) {
      this.snackBar.open("Por favor, genera un informe válido antes de exportar.", "Cerrar", { duration: 3000 })
      return
    }

    // Mostrar mensaje de carga
    const loadingSnackBar = this.snackBar.open("Preparando documento Word, por favor espere...", "", {
      duration: 0,
    })

    // Asegurarse de que los gráficos estén actualizados antes de exportar
    this.initializeCharts()

    // Pequeño retraso para asegurar que los gráficos se rendericen completamente
    setTimeout(() => {
      // Capturar los gráficos como imágenes
      const chartImages: { [key: string]: string } = {}

      const captureCharts = () => {
        return new Promise<void>((resolve) => {
          this.charts.forEach((chart) => {
            const canvas = document.getElementById(chart.id) as HTMLCanvasElement
            if (canvas) {
              chartImages[chart.id] = canvas.toDataURL("image/png")
            }
          })
          resolve()
        })
      }

      captureCharts().then(() => {
        const content = this.materialForm.value.material
        const htmlContent = this.parseMarkdown(content)
        const referencesHtml = this.references

        // Crear HTML para los gráficos con estilo mejorado
        const chartsHtml = `
        <div style="margin:30px 0; padding:20px; background-color:#f9f9f9; border:1px solid #e0e0e0; border-radius:8px;">
          <h2 style="font-size:16pt; color:#333; margin-bottom:20px; text-align:center; border-bottom:1px solid #ddd; padding-bottom:10px;">Análisis Gráfico del Desempeño</h2>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
            ${this.charts
              .map(
                (chart) => `
              <div style="background-color:white; border-radius:8px; padding:15px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
                <h3 style="font-size:14pt; color:#333; margin-bottom:15px; text-align:center;">${chart.title}</h3>
                <img src="${chartImages[chart.id]}" alt="${chart.title}" style="width:100%; max-width:500px; margin:0 auto; display:block;">
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      `

        // Crear un documento Word profesional con estilos mejorados
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Segoe UI', 'Calibri', sans-serif;
              font-size: 12pt;
              line-height: 1.6;
              margin: 25.4mm;
              color: #333;
            }
            h1, h2, h3 {
              font-weight: bold;
              color: #333;
            }
            h1 { font-size: 18pt; text-align: center; }
            h2 { font-size: 16pt; margin-top: 20pt; }
            h3 { font-size: 14pt; margin-top: 15pt; }
            .running-head {
              font-size: 10pt;
              text-transform: uppercase;
              position: absolute;
              top: 12.7mm;
              left: 25.4mm;
              color: #666;
            }
            .page-number {
              font-size: 10pt;
              position: absolute;
              top: 12.7mm;
              right: 25.4mm;
              color: #666;
            }
            .references p {
              text-indent: -36pt;
              margin-left: 36pt;
            }
            .cover-page {
              text-align: center;
              page-break-after: always;
            }
            .page-break { page-break-before: always; }
            ul { margin-left: 36pt; }
            .charts-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin: 20px 0;
            }
            .chart-container {
              text-align: center;
              background-color: white;
              border-radius: 8px;
              padding: 15px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            @media print {
              .charts-grid {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <!-- Cover Page -->
          <div class="cover-page">
            <div class="running-head">Running head: INFORME EVALUATIVO</div>
            <h1>Informe Evaluativo</h1>
            <h2>${this.data.estudiantePrediccion.estudiante.nombres || "Estudiante"} ${this.data.estudiantePrediccion.estudiante.apellidos || ""}</h2>
            <h3>${this.selectedCurricular?.descripcion || ""}</h3>
            <p>Institución Educativa [Nombre]</p>
            <p>Fecha: ${this.today.toLocaleDateString("es-ES", { dateStyle: "long" })}</p>
          </div>
          <!-- Report Content -->
          ${this.temas
            .map(
              (tema, index) => `
            <div class="page-break"></div>
            <div class="running-head">INFORME EVALUATIVO</div>
            <div class="page-number">Página ${index + 1} de ${this.temas.length + 1}</div>
            <h2>${tema.nombre}</h2>
            ${tema.contenido}
            ${tema.nombre === "Análisis de Desempeño" ? chartsHtml : ""}
          `,
            )
            .join("")}
          <!-- References Page -->
          <div class="page-break"></div>
          <div class="running-head">INFORME EVALUATIVO</div>
          <div class="page-number">Página ${this.temas.length + 1} de ${this.temas.length + 1}</div>
          <h2>Referencias</h2>
          <div class="references">${referencesHtml}</div>
        </body>
        </html>
      `

        const blob = new Blob([html], { type: "application/msword" })
        const fileName = `Informe_${this.data.estudiantePrediccion.estudiante.nombres || "Estudiante"}_${this.selectedCurricular?.descripcion}.doc`
        saveAs(blob, fileName)
        loadingSnackBar.dismiss()
        this.snackBar.open("Informe exportado como Word con éxito.", "Cerrar", { duration: 3000 })
      })
    }, 1500) // Aumentar el tiempo de espera para asegurar que los gráficos se rendericen completamente
  }

  closeDialog(): void {
    this.dialogRef.close()
  }

  calculateAge(fechaNacimiento?: Date): number {
    if (!fechaNacimiento) return 0
    const today = new Date()
    const birthDate = new Date(fechaNacimiento)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }
}
