import { Component, OnInit } from "@angular/core"

// Interfaces
interface Estudiante {
  idEstudiante: number
  nombres: string
  apellidos: string
  documentoIdentidad: string
  sexo: string
  activo: boolean
}

interface Curricular {
  idCurricular?: number
  descripcion: string
  activo: boolean
  fechaRegistro: Date
  docenteNivelDetalleCurso?: any
}

interface Calificacion {
  idCalificacion: number
  curricular: Curricular
  estudiante: Estudiante
  nota: number
  activo: boolean
  fechaRegistro: Date
}

interface Periodo {
  idPeriodo: number
  descripcion: string
  fechaInicio: Date
  fechaFin: Date
  activo: boolean
}

enum EstadoPago {
  PAGADO = "PAGADO",
  PENDIENTE = "PENDIENTE",
  EN_PROCESO = "EN_PROCESO",
}

interface Inscripcion {
  idInscripcion: number
  valorCodigo: number
  codigo: string
  situacion: string
  nivelDetalle: any
  estudiante: Estudiante
  acudiente: any
  institucionProcedencia: string
  esRepitente: boolean
  activo: boolean
  fechaRegistro: Date
  montoPago: number
  metodoPago: string
  estadoPago: EstadoPago
}

interface PieSlice {
  nombre: string
  valor: number
  porcentaje: number
  color: string
  startAngle: number
  endAngle: number
}

interface RadarPoint {
  x: number
  y: number
}

interface RadarData {
  estudiante: string
  color: string
  strokeColor: string
  points: string
}

@Component({
  selector: "app-dashboard-admin",
  templateUrl: "./dashboard-admin.component.html",
  styleUrls: ["./dashboard-admin.component.scss"],
})
export class DashboardAdminComponent implements OnInit {
  // Datos
  estudiantes: Estudiante[] = []
  calificaciones: Calificacion[] = []
  inscripciones: Inscripcion[] = []
  curriculares: Curricular[] = []
  periodos: Periodo[] = []

  // Estadísticas
  totalEstudiantes = 0
  totalInscripciones = 0
  totalDocentes = 0
  promedioGeneral = 0

  // Filtros
  selectedPeriodo: number | null = null

  // Datos procesados para gráficos
  promediosPorAsignatura: { nombre: string; valor: number; porcentaje: number }[] = []
  inscripcionesPorGrado: { grado: string; cantidad: number; porcentaje: number }[] = []
  estadosPago: PieSlice[] = []
  distribucionGenero: PieSlice[] = []
  rendimientoEstudiantes: {
    estudiante: string
    asignaturas: { nombre: string; valor: number; porcentaje: number }[]
  }[] = []
  radarData: RadarData[] = []
  asistenciaMensual: {
    mes: string
    asistencia: number
    inasistencia: number
    porcentajeAsistencia: number
    porcentajeInasistencia: number
  }[] = []

  // Puntos para el gráfico de línea
  lineChartPoints = ""
  lineChartPointsArray: { x: number; y: number; valor: number }[] = []

  constructor() {}

  ngOnInit(): void {
    this.cargarDatosEjemplo()
    this.calcularEstadisticas()
    this.procesarDatosParaGraficos()
  }

  cargarDatosEjemplo(): void {
    // Periodos
    this.periodos = [
      {
        idPeriodo: 1,
        descripcion: "2025-1",
        fechaInicio: new Date("2025-01-01"),
        fechaFin: new Date("2025-06-30"),
        activo: true,
      },
      {
        idPeriodo: 2,
        descripcion: "2025-2",
        fechaInicio: new Date("2025-07-01"),
        fechaFin: new Date("2025-12-31"),
        activo: true,
      },
    ]

    // Estudiantes
    this.estudiantes = [
      { idEstudiante: 1, nombres: "Juan", apellidos: "Pérez", documentoIdentidad: "123456", sexo: "M", activo: true },
      { idEstudiante: 2, nombres: "María", apellidos: "Gómez", documentoIdentidad: "789012", sexo: "F", activo: true },
      { idEstudiante: 3, nombres: "Carlos", apellidos: "López", documentoIdentidad: "345678", sexo: "M", activo: true },
      { idEstudiante: 4, nombres: "Ana", apellidos: "Martínez", documentoIdentidad: "901234", sexo: "F", activo: true },
      {
        idEstudiante: 5,
        nombres: "Pedro",
        apellidos: "Rodríguez",
        documentoIdentidad: "567890",
        sexo: "M",
        activo: true,
      },
      {
        idEstudiante: 6,
        nombres: "Laura",
        apellidos: "Sánchez",
        documentoIdentidad: "234567",
        sexo: "F",
        activo: true,
      },
      {
        idEstudiante: 7,
        nombres: "Diego",
        apellidos: "Hernández",
        documentoIdentidad: "890123",
        sexo: "M",
        activo: true,
      },
      { idEstudiante: 8, nombres: "Sofía", apellidos: "Torres", documentoIdentidad: "456789", sexo: "F", activo: true },
    ]

    // Curriculares
    this.curriculares = [
      { idCurricular: 1, descripcion: "Matemáticas", activo: true, fechaRegistro: new Date() },
      { idCurricular: 2, descripcion: "Español", activo: true, fechaRegistro: new Date() },
      { idCurricular: 3, descripcion: "Ciencias", activo: true, fechaRegistro: new Date() },
      { idCurricular: 4, descripcion: "Historia", activo: true, fechaRegistro: new Date() },
      { idCurricular: 5, descripcion: "Inglés", activo: true, fechaRegistro: new Date() },
    ]

    // Calificaciones
    this.calificaciones = [
      {
        idCalificacion: 1,
        curricular: this.curriculares[0],
        estudiante: this.estudiantes[0],
        nota: 4.5,
        activo: true,
        fechaRegistro: new Date(),
      },
      {
        idCalificacion: 2,
        curricular: this.curriculares[1],
        estudiante: this.estudiantes[0],
        nota: 3.8,
        activo: true,
        fechaRegistro: new Date(),
      },
      {
        idCalificacion: 3,
        curricular: this.curriculares[2],
        estudiante: this.estudiantes[0],
        nota: 4.2,
        activo: true,
        fechaRegistro: new Date(),
      },
      {
        idCalificacion: 4,
        curricular: this.curriculares[3],
        estudiante: this.estudiantes[0],
        nota: 3.9,
        activo: true,
        fechaRegistro: new Date(),
      },
      {
        idCalificacion: 5,
        curricular: this.curriculares[4],
        estudiante: this.estudiantes[0],
        nota: 4.7,
        activo: true,
        fechaRegistro: new Date(),
      },

      {
        idCalificacion: 6,
        curricular: this.curriculares[0],
        estudiante: this.estudiantes[1],
        nota: 4.0,
        activo: true,
        fechaRegistro: new Date(),
      },
      {
        idCalificacion: 7,
        curricular: this.curriculares[1],
        estudiante: this.estudiantes[1],
        nota: 4.3,
        activo: true,
        fechaRegistro: new Date(),
      },
      {
        idCalificacion: 8,
        curricular: this.curriculares[2],
        estudiante: this.estudiantes[1],
        nota: 3.5,
        activo: true,
        fechaRegistro: new Date(),
      },
      {
        idCalificacion: 9,
        curricular: this.curriculares[3],
        estudiante: this.estudiantes[1],
        nota: 4.1,
        activo: true,
        fechaRegistro: new Date(),
      },
      {
        idCalificacion: 10,
        curricular: this.curriculares[4],
        estudiante: this.estudiantes[1],
        nota: 3.9,
        activo: true,
        fechaRegistro: new Date(),
      },

      {
        idCalificacion: 11,
        curricular: this.curriculares[0],
        estudiante: this.estudiantes[2],
        nota: 3.2,
        activo: true,
        fechaRegistro: new Date(),
      },
      {
        idCalificacion: 12,
        curricular: this.curriculares[1],
        estudiante: this.estudiantes[2],
        nota: 3.7,
        activo: true,
        fechaRegistro: new Date(),
      },
      {
        idCalificacion: 13,
        curricular: this.curriculares[2],
        estudiante: this.estudiantes[2],
        nota: 4.0,
        activo: true,
        fechaRegistro: new Date(),
      },
      {
        idCalificacion: 14,
        curricular: this.curriculares[3],
        estudiante: this.estudiantes[2],
        nota: 3.5,
        activo: true,
        fechaRegistro: new Date(),
      },
      {
        idCalificacion: 15,
        curricular: this.curriculares[4],
        estudiante: this.estudiantes[2],
        nota: 3.8,
        activo: true,
        fechaRegistro: new Date(),
      },
    ]

    // Inscripciones
    this.inscripciones = [
      {
        idInscripcion: 1,
        valorCodigo: 1001,
        codigo: "INS001",
        situacion: "Regular",
        nivelDetalle: {
          idNivelDetalle: 1,
          nivel: {
            idNivel: 1,
            periodo: this.periodos[0],
            descripcionNivel: "Bachillerato",
            descripcionTurno: "Mañana",
            horaInicio: "07:00",
            horaFin: "13:00",
            activo: true,
          },
          gradoSeccion: { idGradoSeccion: 1, descripcionGrado: "11", descripcionSeccion: "A", activo: true },
          totalVacantes: 30,
          vacantesDisponibles: 10,
          vacantesOcupadas: 20,
          activo: true,
        },
        estudiante: this.estudiantes[0],
        acudiente: {
          nombres: "Ana",
          apellidos: "Pérez",
          documentoIdentidad: "987654",
          ciudad: "Bogotá",
          direccion: "Calle 123",
          estadoCivil: "Casada",
          sexo: "F",
          telefono: "3001234567",
          activo: true,
        },
        institucionProcedencia: "Colegio XYZ",
        esRepitente: false,
        activo: true,
        fechaRegistro: new Date(),
        montoPago: 500000,
        metodoPago: "Transferencia",
        estadoPago: EstadoPago.PAGADO,
      },
      {
        idInscripcion: 2,
        valorCodigo: 1002,
        codigo: "INS002",
        situacion: "Regular",
        nivelDetalle: {
          idNivelDetalle: 1,
          nivel: {
            idNivel: 1,
            periodo: this.periodos[0],
            descripcionNivel: "Bachillerato",
            descripcionTurno: "Mañana",
            horaInicio: "07:00",
            horaFin: "13:00",
            activo: true,
          },
          gradoSeccion: { idGradoSeccion: 1, descripcionGrado: "11", descripcionSeccion: "A", activo: true },
          totalVacantes: 30,
          vacantesDisponibles: 10,
          vacantesOcupadas: 20,
          activo: true,
        },
        estudiante: this.estudiantes[1],
        acudiente: {
          nombres: "Luis",
          apellidos: "Gómez",
          documentoIdentidad: "654321",
          ciudad: "Medellín",
          direccion: "Carrera 456",
          estadoCivil: "Soltero",
          sexo: "M",
          telefono: "3009876543",
          activo: true,
        },
        institucionProcedencia: "Colegio ABC",
        esRepitente: false,
        activo: true,
        fechaRegistro: new Date(),
        montoPago: 500000,
        metodoPago: "Efectivo",
        estadoPago: EstadoPago.PENDIENTE,
      },
      {
        idInscripcion: 3,
        valorCodigo: 1003,
        codigo: "INS003",
        situacion: "Regular",
        nivelDetalle: {
          idNivelDetalle: 2,
          nivel: {
            idNivel: 1,
            periodo: this.periodos[0],
            descripcionNivel: "Bachillerato",
            descripcionTurno: "Tarde",
            horaInicio: "13:00",
            horaFin: "19:00",
            activo: true,
          },
          gradoSeccion: { idGradoSeccion: 2, descripcionGrado: "10", descripcionSeccion: "B", activo: true },
          totalVacantes: 30,
          vacantesDisponibles: 15,
          vacantesOcupadas: 15,
          activo: true,
        },
        estudiante: this.estudiantes[2],
        acudiente: {
          nombres: "Carmen",
          apellidos: "López",
          documentoIdentidad: "123789",
          ciudad: "Cali",
          direccion: "Avenida 789",
          estadoCivil: "Casada",
          sexo: "F",
          telefono: "3005678901",
          activo: true,
        },
        institucionProcedencia: "Colegio DEF",
        esRepitente: true,
        activo: true,
        fechaRegistro: new Date(),
        montoPago: 500000,
        metodoPago: "Tarjeta",
        estadoPago: EstadoPago.EN_PROCESO,
      },
      {
        idInscripcion: 4,
        valorCodigo: 1004,
        codigo: "INS004",
        situacion: "Regular",
        nivelDetalle: {
          idNivelDetalle: 2,
          nivel: {
            idNivel: 1,
            periodo: this.periodos[0],
            descripcionNivel: "Bachillerato",
            descripcionTurno: "Tarde",
            horaInicio: "13:00",
            horaFin: "19:00",
            activo: true,
          },
          gradoSeccion: { idGradoSeccion: 2, descripcionGrado: "10", descripcionSeccion: "B", activo: true },
          totalVacantes: 30,
          vacantesDisponibles: 15,
          vacantesOcupadas: 15,
          activo: true,
        },
        estudiante: this.estudiantes[3],
        acudiente: {
          nombres: "Roberto",
          apellidos: "Martínez",
          documentoIdentidad: "456123",
          ciudad: "Barranquilla",
          direccion: "Calle 456",
          estadoCivil: "Casado",
          sexo: "M",
          telefono: "3002345678",
          activo: true,
        },
        institucionProcedencia: "Colegio GHI",
        esRepitente: false,
        activo: true,
        fechaRegistro: new Date(),
        montoPago: 500000,
        metodoPago: "Transferencia",
        estadoPago: EstadoPago.PAGADO,
      },
      {
        idInscripcion: 5,
        valorCodigo: 1005,
        codigo: "INS005",
        situacion: "Regular",
        nivelDetalle: {
          idNivelDetalle: 3,
          nivel: {
            idNivel: 2,
            periodo: this.periodos[1],
            descripcionNivel: "Bachillerato",
            descripcionTurno: "Mañana",
            horaInicio: "07:00",
            horaFin: "13:00",
            activo: true,
          },
          gradoSeccion: { idGradoSeccion: 3, descripcionGrado: "9", descripcionSeccion: "A", activo: true },
          totalVacantes: 30,
          vacantesDisponibles: 20,
          vacantesOcupadas: 10,
          activo: true,
        },
        estudiante: this.estudiantes[4],
        acudiente: {
          nombres: "Marta",
          apellidos: "Rodríguez",
          documentoIdentidad: "789456",
          ciudad: "Cartagena",
          direccion: "Avenida 123",
          estadoCivil: "Divorciada",
          sexo: "F",
          telefono: "3007890123",
          activo: true,
        },
        institucionProcedencia: "Colegio JKL",
        esRepitente: false,
        activo: true,
        fechaRegistro: new Date(),
        montoPago: 500000,
        metodoPago: "Efectivo",
        estadoPago: EstadoPago.PENDIENTE,
      },
    ]
  }

  calcularEstadisticas(): void {
    this.totalEstudiantes = this.estudiantes.length
    this.totalInscripciones = this.inscripciones.length
    this.totalDocentes = 5 // Ejemplo

    // Calcular promedio general
    const notas = this.calificaciones.map((c) => c.nota)
    this.promedioGeneral = notas.reduce((a, b) => a + b, 0) / notas.length
  }

  procesarDatosParaGraficos(): void {
    this.procesarPromediosPorAsignatura()
    this.procesarInscripcionesPorGrado()
    this.procesarEstadosPago()
    this.procesarDistribucionGenero()
    this.procesarRendimientoEstudiantes()
    this.procesarAsistenciaMensual()
    this.generarPuntosGraficoLinea()
    this.generarDatosRadar()
  }

  procesarPromediosPorAsignatura(): void {
    this.promediosPorAsignatura = this.curriculares.map((curricular) => {
      const calificacionesAsignatura = this.calificaciones.filter(
        (c) => c.curricular.idCurricular === curricular.idCurricular,
      )
      const promedio = calificacionesAsignatura.reduce((sum, c) => sum + c.nota, 0) / calificacionesAsignatura.length
      return {
        nombre: curricular.descripcion,
        valor: promedio,
        porcentaje: (promedio / 5) * 100, // Considerando que 5 es la nota máxima
      }
    })
  }

  procesarInscripcionesPorGrado(): void {
    const inscripcionesPorGrado = new Map<string, number>()

    this.inscripciones.forEach((inscripcion) => {
      const grado = inscripcion.nivelDetalle.gradoSeccion.descripcionGrado
      if (inscripcionesPorGrado.has(grado)) {
        inscripcionesPorGrado.set(grado, inscripcionesPorGrado.get(grado)! + 1)
      } else {
        inscripcionesPorGrado.set(grado, 1)
      }
    })

    const totalInscripciones = this.inscripciones.length

    this.inscripcionesPorGrado = Array.from(inscripcionesPorGrado.entries()).map(([grado, cantidad]) => {
      return {
        grado,
        cantidad,
        porcentaje: (cantidad / totalInscripciones) * 100,
      }
    })
  }

  procesarEstadosPago(): void {
    const estadosPago = new Map<string, number>()

    this.inscripciones.forEach((inscripcion) => {
      const estado = inscripcion.estadoPago
      if (estadosPago.has(estado)) {
        estadosPago.set(estado, estadosPago.get(estado)! + 1)
      } else {
        estadosPago.set(estado, 1)
      }
    })

    const totalInscripciones = this.inscripciones.length
    let acumulado = 0

    this.estadosPago = Array.from(estadosPago.entries()).map(([estado, cantidad], index) => {
      const porcentaje = (cantidad / totalInscripciones) * 100
      let color = ""
      switch (estado) {
        case EstadoPago.PAGADO:
          color = "#4CAF50" // Verde
          break
        case EstadoPago.PENDIENTE:
          color = "#FF9800" // Naranja
          break
        case EstadoPago.EN_PROCESO:
          color = "#2196F3" // Azul
          break
        default:
          color = "#9E9E9E" // Gris
      }

      const startAngle = acumulado
      acumulado += porcentaje / 100 * 360
      const endAngle = acumulado

      return {
        nombre: estado,
        valor: cantidad,
        porcentaje,
        color,
        startAngle,
        endAngle
      }
    })
  }

  procesarDistribucionGenero(): void {
    const masculinos = this.estudiantes.filter((e) => e.sexo === "M").length
    const femeninos = this.estudiantes.filter((e) => e.sexo === "F").length
    const total = this.estudiantes.length

    const porcentajeMasculino = (masculinos / total) * 100
    const porcentajeFemenino = (femeninos / total) * 100

    this.distribucionGenero = [
      {
        nombre: "Masculino",
        valor: masculinos,
        porcentaje: porcentajeMasculino,
        color: "#2196F3", // Azul
        startAngle: 0,
        endAngle: porcentajeMasculino / 100 * 360
      },
      {
        nombre: "Femenino",
        valor: femeninos,
        porcentaje: porcentajeFemenino,
        color: "#E91E63", // Rosa
        startAngle: porcentajeMasculino / 100 * 360,
        endAngle: 360
      },
    ]
  }

  procesarRendimientoEstudiantes(): void {
    // Tomamos solo los primeros 2 estudiantes para el ejemplo
    this.rendimientoEstudiantes = this.estudiantes.slice(0, 2).map((estudiante) => {
      const asignaturas = this.curriculares.map((curricular) => {
        const calificacion = this.calificaciones.find(
          (c) =>
            c.estudiante.idEstudiante === estudiante.idEstudiante &&
            c.curricular.idCurricular === curricular.idCurricular,
        )
        const valor = calificacion ? calificacion.nota : 0
        return {
          nombre: curricular.descripcion,
          valor,
          porcentaje: (valor / 5) * 100, // Considerando que 5 es la nota máxima
        }
      })

      return {
        estudiante: `${estudiante.nombres} ${estudiante.apellidos}`,
        asignaturas,
      }
    })
  }

  generarDatosRadar(): void {
    const colores = ["rgba(33, 150, 243, 0.3)", "rgba(233, 30, 99, 0.3)"]
    const strokeColores = ["rgba(33, 150, 243, 0.8)", "rgba(233, 30, 99, 0.8)"]

    this.radarData = this.rendimientoEstudiantes.map((estudiante, idx) => {
      const points = this.calcularPuntosRadar(estudiante.asignaturas)
      return {
        estudiante: estudiante.estudiante,
        color: colores[idx],
        strokeColor: strokeColores[idx],
        points
      }
    })
  }

  calcularPuntosRadar(asignaturas: { nombre: string; valor: number; porcentaje: number }[]): string {
    const puntos: string[] = []
    
    asignaturas.forEach((item, i) => {
      const angle = i * (2 * Math.PI / asignaturas.length)
      const r = item.porcentaje / 2
      puntos.push(`${50 + r * Math.sin(angle)},${50 - r * Math.cos(angle)}`)
    })
    
    return puntos.join(' ')
  }

  procesarAsistenciaMensual(): void {
    // Datos de ejemplo para asistencia mensual
    this.asistenciaMensual = [
      { mes: "Enero", asistencia: 95, inasistencia: 5, porcentajeAsistencia: 95, porcentajeInasistencia: 5 },
      { mes: "Febrero", asistencia: 92, inasistencia: 8, porcentajeAsistencia: 92, porcentajeInasistencia: 8 },
      { mes: "Marzo", asistencia: 88, inasistencia: 12, porcentajeAsistencia: 88, porcentajeInasistencia: 12 },
      { mes: "Abril", asistencia: 90, inasistencia: 10, porcentajeAsistencia: 90, porcentajeInasistencia: 10 },
      { mes: "Mayo", asistencia: 93, inasistencia: 7, porcentajeAsistencia: 93, porcentajeInasistencia: 7 },
    ]
  }

  generarPuntosGraficoLinea(): void {
    const puntos: { x: number; y: number; valor: number }[] = []
    
    this.inscripcionesPorGrado.forEach((item, index) => {
      const x = index * (100 / (this.inscripcionesPorGrado.length - 1))
      const y = 100 - (item.cantidad / 5) * 100
      puntos.push({ x, y, valor: item.cantidad })
    })
    
    this.lineChartPointsArray = puntos
    
    // Generar string de puntos para el polyline
    this.lineChartPoints = puntos.map(p => `${p.x},${p.y}`).join(' ')
  }

  applyFilter(): void {
    console.log("Filtrando por período:", this.selectedPeriodo)
    // Aquí iría la lógica para filtrar los datos según el período seleccionado
    // Luego actualizar los gráficos
    this.procesarDatosParaGraficos()
  }

  refreshData(): void {
    // Simular recarga de datos
    this.procesarDatosParaGraficos()
  }

  getEstiloPieSlice(slice: PieSlice): object {
    return {
      'background': `conic-gradient(${slice.color} ${slice.startAngle}deg, ${slice.color} ${slice.endAngle}deg, transparent ${slice.endAngle}deg)`,
      'opacity': '1'
    }
  }
}
