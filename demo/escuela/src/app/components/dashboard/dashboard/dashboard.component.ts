import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentDate: Date = new Date();

  // Declare classroomData as a class property
  classroomData: { [key: string]: any } = {
    'Primero A': {
      rendimiento: { aprobados: 82, desaprobados: 18 },
      asistencia: { si: 91, no: 9 },
      repitencia: { si: 12, no: 88 },
      pago: {
        detalles: [
          { metodo_pago: 'Efectivo', fecha_pago: null, cantidad: 10 }, // EN_PROCESO
          { metodo_pago: 'Tarjeta', fecha_pago: null, cantidad: 5 },  // EN_PROCESO
          { metodo_pago: null, fecha_pago: null, cantidad: 5 },       // PENDIENTE
          { metodo_pago: 'Efectivo', fecha_pago: '2025-03-01', cantidad: 10 } // PAGADO
        ]
      },
      notaPromedio: 3.92,
      asistenciaPromedio: 91.5,
      edadPromedio: 12.3,
      estudiantesTotales: 30,
      precisionModelo: 0.87
    },
    'Primero B': {
      rendimiento: { aprobados: 68, desaprobados: 32 },
      asistencia: { si: 84, no: 16 },
      repitencia: { si: 19, no: 81 },
      pago: {
        detalles: [
          { metodo_pago: 'Efectivo', fecha_pago: null, cantidad: 8 },  // EN_PROCESO
          { metodo_pago: 'Tarjeta', fecha_pago: null, cantidad: 7 },  // EN_PROCESO
          { metodo_pago: null, fecha_pago: null, cantidad: 8 },       // PENDIENTE
          { metodo_pago: 'Tarjeta', fecha_pago: '2025-03-01', cantidad: 5 } // PAGADO
        ]
      },
      notaPromedio: 3.47,
      asistenciaPromedio: 83.2,
      edadPromedio: 12.5,
      estudiantesTotales: 28,
      precisionModelo: 0.85
    },
    'Primero C': {
      rendimiento: { aprobados: 63, desaprobados: 37 },
      asistencia: { si: 77, no: 23 },
      repitencia: { si: 24, no: 76 },
      pago: {
        detalles: [
          { metodo_pago: 'Efectivo', fecha_pago: null, cantidad: 7 },  // EN_PROCESO
          { metodo_pago: 'Tarjeta', fecha_pago: null, cantidad: 6 },  // EN_PROCESO
          { metodo_pago: null, fecha_pago: null, cantidad: 9 },       // PENDIENTE
          { metodo_pago: 'Efectivo', fecha_pago: '2025-03-01', cantidad: 10 } // PAGADO
        ]
      },
      notaPromedio: 3.18,
      asistenciaPromedio: 76.8,
      edadPromedio: 12.4,
      estudiantesTotales: 32,
      precisionModelo: 0.83
    }
  };

  // Declare other missing properties
  selectedClassroom: string = 'Primero A';
  classrooms: string[] = Object.keys(this.classroomData);
  predictionSections: any[] = []; // Initialize as empty array

  ngOnInit(): void {
    this.updatePredictionSections(); // Call initially to populate data
    setInterval(() => this.currentDate = new Date(), 1000); // Update date every second
  }

  updatePredictionSections(): void {
    const data = this.getCurrentData();
    const paymentStats = this.getPaymentStats();
    const paymentTotal = this.getPaymentTotal();

    this.predictionSections = [
      {
        title: 'Rendimiento Académico',
        description: 'Predicción: ¿Aprobará el estudiante? (nota ≥ 3.0)',
        percentage: this.getPercentage(data.rendimiento.aprobados, data.rendimiento.aprobados + data.rendimiento.desaprobados),
        legend: [
          { label: 'Aprobados', value: data.rendimiento.aprobados, class: 'approved' },
          { label: 'Desaprobados', value: data.rendimiento.desaprobados, class: 'failed' }
        ],
        extra: { label: 'Nota Promedio', value: data.notaPromedio.toFixed(2) }
      },
      {
        title: 'Asistencia',
        description: 'Predicción: ¿Asistirá el estudiante?',
        percentage: this.getPercentage(data.asistencia.si, data.asistencia.si + data.asistencia.no),
        legend: [
          { label: 'Sí', value: data.asistencia.si, class: 'approved' },
          { label: 'No', value: data.asistencia.no, class: 'failed' }
        ],
        extra: { label: 'Promedio', value: data.asistenciaPromedio.toFixed(1) + '%' }
      },
      {
        title: 'Repitencia',
        description: 'Predicción: ¿Repetirá el estudiante?',
        percentage: this.getPercentage(data.repitencia.no, data.repitencia.si + data.repitencia.no),
        legend: [
          { label: 'No', value: data.repitencia.no, class: 'approved' },
          { label: 'Sí', value: data.repitencia.si, class: 'failed' }
        ]
      },
      {
        title: 'Estado de Pago',
        description: 'Predicción con JRip: ¿Cuál es el estado del pago?',
        percentage: this.getPercentage(paymentStats.pagado, paymentTotal),
        legend: [
          { label: 'Pagado', value: this.getPercentage(paymentStats.pagado, paymentTotal), class: 'approved' },
          { label: 'Pendiente', value: this.getPercentage(paymentStats.pendiente, paymentTotal), class: 'failed' },
          { label: 'En Proceso', value: this.getPercentage(paymentStats.en_proceso, paymentTotal), class: 'in-process' }
        ]
      }
    ];
  }

  // Aplicar reglas JRip para predecir estado_pago
  predictPaymentStatus(metodo_pago: string | null, fecha_pago: string | null): string {
    if (!fecha_pago) {
      if (metodo_pago === 'Efectivo' || metodo_pago === 'Tarjeta') {
        return 'EN_PROCESO';
      }
      return 'PENDIENTE';
    }
    return 'PAGADO';
  }

  // Calcular totales de pago según predicciones
  getPaymentStats(): { pagado: number; pendiente: number; en_proceso: number } {
    const detalles = this.getCurrentData().pago.detalles;
    let pagado = 0, pendiente = 0, en_proceso = 0;

    detalles.forEach((detalle: any) => {
      const status = this.predictPaymentStatus(detalle.metodo_pago, detalle.fecha_pago);
      switch (status) {
        case 'PAGADO':
          pagado += detalle.cantidad;
          break;
        case 'PENDIENTE':
          pendiente += detalle.cantidad;
          break;
        case 'EN_PROCESO':
          en_proceso += detalle.cantidad;
          break;
      }
    });

    return { pagado, pendiente, en_proceso };
  }

  getPaymentTotal(): number {
    const stats = this.getPaymentStats();
    return stats.pagado + stats.pendiente + stats.en_proceso;
  }

  getPercentage(value: number, total: number): number {
    return total ? Math.round((value / total) * 100) : 0;
  }

  getProgressOffset(percentage: number): number {
    const circumference = 2 * Math.PI * 54; // Radius = 54
    return circumference - (percentage / 100) * circumference;
  }

  changeClassroom(event: MatSelectChange): void {
    this.selectedClassroom = event.value;
    this.updatePredictionSections();
  }

  getCurrentData(): any {
    return this.classroomData[this.selectedClassroom] || {
      rendimiento: { aprobados: 0, desaprobados: 0 },
      asistencia: { si: 0, no: 0 },
      repitencia: { si: 0, no: 88 }, // Fixed typo: 'no: 88' instead of 'no: 0'
      pago: { detalles: [] },
      notaPromedio: 0,
      asistenciaPromedio: 0,
      edadPromedio: 0,
      estudiantesTotales: 0,
      precisionModelo: 0
    };
  }
}