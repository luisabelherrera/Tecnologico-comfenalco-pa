import { Injectable } from '@angular/core';
import { PeriodoService } from 'src/app/services/periodo/periodo.service';
import { Periodo } from 'src/app/models/entity/Periodo.interface';
import { Router } from '@angular/router';
import { PeriodoCreationData } from '../models-ia/periodo-creation-data.interface';
import { ChatHistoryService } from './chat-history.service';


@Injectable({
  providedIn: 'root',
})
export class PeriodoHandlerService {
  periodoCreationState: 'none' | 'askingYear' | 'askingDay' | 'askingMonth' | 'askingEndYear' | 'askingEndDay' | 'askingEndMonth' | 'complete' = 'none';
  periodoData: PeriodoCreationData = {
    descripcion: 'Periodo generado por voz en El Hobo',
    activo: true,
  };

  constructor(
    private periodoService: PeriodoService,
    private router: Router,
    private chatHistoryService: ChatHistoryService
  ) {}

  startPeriodoCreation(speak: (text: string) => void): void {
    this.periodoCreationState = 'askingYear';
    const responseText = 'Como administrador en El Hobo, ¿en qué año quieres que inicie el periodo?';
    speak(responseText);
    this.chatHistoryService.addToChatHistory('ai', responseText);
  }

  handlePeriodoCreationFlow(transcript: string, speak: (text: string) => void): boolean {
    console.log('Estado actual del flujo:', this.periodoCreationState);
    if (this.periodoCreationState === 'askingYear') {
      const yearMatch = transcript.match(/\d{4}/);
      if (yearMatch) {
        this.periodoData.descripcion = `Periodo ${yearMatch[0]} en El Hobo`;
        this.periodoCreationState = 'askingDay';
        const responseText = `Año ${yearMatch[0]}. ¿Qué día?`;
        speak(responseText);
        this.chatHistoryService.addToChatHistory('ai', responseText);
      } else {
        const responseText = 'No entendí el año. Dime un año, como 2025.';
        speak(responseText);
        this.chatHistoryService.addToChatHistory('ai', responseText);
      }
    } else if (this.periodoCreationState === 'askingDay') {
      const dayMatch = transcript.match(/\d{1,2}/);
      if (dayMatch && parseInt(dayMatch[0]) >= 1 && parseInt(dayMatch[0]) <= 31) {
        this.periodoData.diaInicio = parseInt(dayMatch[0]);
        this.periodoCreationState = 'askingMonth';
        const responseText = `Día ${dayMatch[0]}. ¿Qué mes?`;
        speak(responseText);
        this.chatHistoryService.addToChatHistory('ai', responseText);
      } else {
        const responseText = 'No entendí el día. Dime un número entre 1 y 31.';
        speak(responseText);
        this.chatHistoryService.addToChatHistory('ai', responseText);
      }
    } else if (this.periodoCreationState === 'askingMonth') {
      const monthMap: { [key: string]: number } = {
        enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
        julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
      };
      const month = Object.keys(monthMap).find(m => transcript.includes(m));
      if (month) {
        this.periodoData.mesInicio = monthMap[month];
        this.periodoCreationState = 'askingEndYear';
        const responseText = `Mes ${month}. ¿En qué año quieres que finalice el periodo?`;
        speak(responseText);
        this.chatHistoryService.addToChatHistory('ai', responseText);
      } else {
        const responseText = 'No entendí el mes. Dime un mes, como enero o febrero.';
        speak(responseText);
        this.chatHistoryService.addToChatHistory('ai', responseText);
      }
    } else if (this.periodoCreationState === 'askingEndYear') {
      const yearMatch = transcript.match(/\d{4}/);
      if (yearMatch) {
        this.periodoData.descripcion = `Periodo desde ${this.periodoData.descripcion.split(' ')[1]} hasta ${yearMatch[0]} en El Hobo`;
        this.periodoCreationState = 'askingEndDay';
        const responseText = `Año ${yearMatch[0]}. ¿Qué día de finalización?`;
        speak(responseText);
        this.chatHistoryService.addToChatHistory('ai', responseText);
      } else {
        const responseText = 'No entendí el año. Dime un año, como 2025.';
        speak(responseText);
        this.chatHistoryService.addToChatHistory('ai', responseText);
      }
    } else if (this.periodoCreationState === 'askingEndDay') {
      const dayMatch = transcript.match(/\d{1,2}/);
      if (dayMatch && parseInt(dayMatch[0]) >= 1 && parseInt(dayMatch[0]) <= 31) {
        this.periodoData.diaFin = parseInt(dayMatch[0]);
        this.periodoCreationState = 'askingEndMonth';
        const responseText = `Día ${dayMatch[0]}. ¿Qué mes de finalización?`;
        speak(responseText);
        this.chatHistoryService.addToChatHistory('ai', responseText);
      } else {
        const responseText = 'No entendí el día. Dime un número entre 1 y 31.';
        speak(responseText);
        this.chatHistoryService.addToChatHistory('ai', responseText);
      }
    } else if (this.periodoCreationState === 'askingEndMonth') {
      const monthMap: { [key: string]: number } = {
        enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
        julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
      };
      const month = Object.keys(monthMap).find(m => transcript.includes(m));
      if (month) {
        this.periodoData.mesFin = monthMap[month];
        this.completePeriodoCreation(speak);
        return true; // Indica que el flujo ha terminado
      } else {
        const responseText = 'No entendí el mes. Dime un mes, como enero o febrero.';
        speak(responseText);
        this.chatHistoryService.addToChatHistory('ai', responseText);
      }
    }
    return false; // Indica que el flujo no ha terminado
  }

  private completePeriodoCreation(speak: (text: string) => void): void {
    if (this.periodoData.descripcion && this.periodoData.diaInicio && this.periodoData.mesInicio && this.periodoData.diaFin && this.periodoData.mesFin) {
      const [startYear] = this.periodoData.descripcion.match(/\d{4}/) || [];
      const [endYear] = this.periodoData.descripcion.match(/\d{4}(?=\s+en)/) || [];
      
      if (!startYear || !endYear) {
        const responseText = 'No se pudo determinar los años del periodo en El Hobo.';
        speak(responseText);
        this.chatHistoryService.addToChatHistory('ai', responseText);
        this.resetPeriodoCreation();
        return;
      }

      const fechaInicio = new Date(parseInt(startYear), this.periodoData.mesInicio, this.periodoData.diaInicio);
      const fechaFin = new Date(parseInt(endYear), this.periodoData.mesFin, this.periodoData.diaFin);

      if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime()) || fechaInicio >= fechaFin) {
        const responseText = 'Las fechas proporcionadas no son válidas o el periodo de inicio es posterior al fin en El Hobo.';
        speak(responseText);
        this.chatHistoryService.addToChatHistory('ai', responseText);
        this.resetPeriodoCreation();
        return;
      }

      const periodo: Periodo = {
        idPeriodo: 0,
        descripcion: this.periodoData.descripcion,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        activo: this.periodoData.activo || true,
      };

      const responseText = `Abriendo formulario para crear el periodo en El Hobo desde el ${fechaInicio.toLocaleDateString()} hasta el ${fechaFin.toLocaleDateString()} como administrador...`;
      speak(responseText);
      this.chatHistoryService.addToChatHistory('ai', responseText);

      this.router.navigate(['/periodo'], {
        queryParams: {
          descripcion: periodo.descripcion,
          fechaInicio: periodo.fechaInicio.toISOString(),
          fechaFin: periodo.fechaFin.toISOString(),
          activo: periodo.activo,
        },
      }).then(() => {
        console.log('Navegación completada');
      }).catch(err => {
        console.error('Error en la navegación:', err);
        const errorText = 'Error al navegar al formulario de periodo en El Hobo.';
        speak(errorText);
        this.chatHistoryService.addToChatHistory('ai', errorText);
      });

      this.resetPeriodoCreation();
    }
  }

  resetPeriodoCreation(): void {
    this.periodoCreationState = 'none';
    this.periodoData = {
      descripcion: 'Periodo generado por voz en El Hobo',
      activo: true,
    };
  }

  getPeriodosCount(speak: (text: string) => void): void {
    this.periodoService.getPeriodosCount().subscribe(
      (count) => {
        const response = `Tienes ${count} periodos en total en EduPortal como administrador.`;
        console.log(response);
        speak(response);
        this.chatHistoryService.addToChatHistory('ai', response);
      },
      (error) => {
        console.error('Error al obtener el número de periodos:', error);
        const responseText = 'Error al obtener la cantidad de periodos en El Hobo.';
        speak(responseText);
        this.chatHistoryService.addToChatHistory('ai', responseText);
      }
    );
  }

  getPeriodosInactivos(speak: (text: string) => void): void {
    this.periodoService.getPeriodosInactivos().subscribe(
      (count) => {
        const response = `Tienes ${count} periodos inactivos en EduPortal como administrador.`;
        console.log(response);
        speak(response);
        this.chatHistoryService.addToChatHistory('ai', response);
      },
      (error) => {
        console.error('Error al obtener los periodos inactivos:', error);
        const responseText = 'Error al obtener los periodos inactivos en EduPortal.';
        speak(responseText);
        this.chatHistoryService.addToChatHistory('ai', responseText);
      }
    );
  }

  getPeriodosActivos(speak: (text: string) => void): void {
    this.periodoService.getPeriodosActivos().subscribe(
      (count) => {
        const response = `Tienes ${count} periodos activos en El Hobo como administrador.`;
        console.log(response);
        speak(response);
        this.chatHistoryService.addToChatHistory('ai', response);
      },
      (error) => {
        console.error('Error al obtener los periodos activos:', error);
        const responseText = 'Error al obtener los periodos activos en El Hobo.';
        speak(responseText);
        this.chatHistoryService.addToChatHistory('ai', responseText);
      }
    );
  }

  createRandomPeriodo(speak: (text: string) => void): void {
    const fechaInicio = this.generateRandomDate(2020, 2025);
    const fechaFin = new Date(fechaInicio.getTime() + Math.random() * (90 * 24 * 60 * 60 * 1000));
    const randomYear = this.generateRandomYear(2020, 2025);
    const descripcion = `${randomYear} en EduPortal`;

    const periodo: Periodo = {
      idPeriodo: 0,
      descripcion: descripcion,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      activo: true,
    };

    this.periodoService.create(periodo).subscribe(
      (response: any) => {
        const responseText = `Nuevo periodo creado en El Hobo: ${response.descripcion}`;
        speak(responseText);
        this.chatHistoryService.addToChatHistory('ai', responseText);
      },
      (error) => {
        console.error('Error al crear el periodo en El Hobo:', error);
        const responseText = 'No se pudo crear el periodo en El Hobo.';
        speak(responseText);
        this.chatHistoryService.addToChatHistory('ai', responseText);
      }
    );
  }

  private generateRandomDate(startYear: number, endYear: number): Date {
    const startDate = new Date(startYear, 0, 1);
    const endDate = new Date(endYear, 11, 31);
    return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
  }

  private generateRandomYear(startYear: number, endYear: number): number {
    return Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  }
}