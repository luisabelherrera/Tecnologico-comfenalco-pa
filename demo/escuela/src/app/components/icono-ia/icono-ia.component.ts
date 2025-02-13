

import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PeriodoService } from 'src/app/services/periodo/periodo.service';
import { Periodo } from 'src/app/models/entity/Periodo.interface';

@Component({
  selector: 'app-icono-ia',
  templateUrl: './icono-ia.component.html',
  styleUrls: ['./icono-ia.component.scss'],
})
export class IconoIaComponent {
  userInput: string = '';
  responseText: string = '';
  private apiKey: string = 'AIzaSyB9HNN9nYfHK07TlZiCjMG-qVXZ2u70Rxc';
  private apiUrl: string = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`;
  isInStudentPlatform: boolean = false;
  recognition: any;
  isRecording: boolean = false;
  isInHoboPlatform: boolean = false; 
  constructor(private http: HttpClient, private periodoService: PeriodoService) {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.lang = 'es-ES';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
    } else {
      console.warn('El reconocimiento de voz no está soportado en este navegador.');
      this.responseText = '⚠️ El reconocimiento de voz no está soportado en este navegador.';
    }
  }

  startVoiceRecognition() {
    if (this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    } else {
      try {
        this.recognition.start();
        this.isRecording = true;
      } catch (error) {
        console.error('Error al iniciar el reconocimiento de voz:', error);
        this.responseText = '⚠️ Hubo un error al iniciar el reconocimiento de voz.';
      }
    }
  
    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      console.log('Texto reconocido:', transcript);
  
      if (transcript.includes("crear periodo")) {
        this.createPeriodo(); 
      } else if (transcript.includes("cuántos periodos tengo")) {
        this.getPeriodosCount();
      } else if (transcript.includes("cuántos periodos inactivos tengo")) {
        this.getPeriodosInactivos();
      } else if (transcript.includes("cuántos periodos activos tengo")) {
        this.getPeriodosActivos();
      } else if (this.isInStudentPlatform) {

        this.handleStudentPlatformQuery(transcript);
      } else {
   
        this.sendToAI(transcript); 
      }
    };
  }

handleStudentPlatformQuery(query: string) {
  if (this.isInHoboPlatform) {
    const periodPattern = /qué puedo hacer con este periodo|qué tengo que hacer en este periodo/i;
    
    if (periodPattern.test(query)) {
      this.responseText = 'Con este periodo, puedes consultar tus tareas, ver tus calificaciones y acceder a las actividades programadas.';
      this.speak(this.responseText);
    } else {
      this.sendToAI(query);  
  }}
}

  handlePlatformQuery(query: string) {
    if (this.isInHoboPlatform) {
      if (query.includes("hago en la plataforma")) {
        this.responseText = 'En la plataforma "El Hobo", puedes consultar tus tareas, ver notificaciones, etc.';
        this.speak(this.responseText);
      } else if (query.includes("ver mi progreso")) {
        this.responseText = 'Aquí está tu progreso en "El Hobo"...';
        this.speak(this.responseText);
      } else {
        this.sendToAI(query);
      }
    } else {
      this.responseText = `No entiendo la pregunta: "${query}"`;
      this.speak(this.responseText);
      this.sendToAI(query);
    }
  }
  
  enterStudentPlatform() {
    this.isInStudentPlatform = true;
    this.responseText = 'Has entrado a la plataforma estudiantil. ¿En qué puedo ayudarte con tus tareas?';
    this.speak(this.responseText);
  }

  exitStudentPlatform() {
    this.isInStudentPlatform = false;
    this.responseText = 'Has salido de la plataforma estudiantil.';
    this.speak(this.responseText);
  }

  
  getPeriodosCount() {
    this.periodoService.getPeriodosCount().subscribe(
      (count) => {
        const response = `Tienes ${count} periodos en total.`;
        console.log(response);
        this.responseText = response;
        this.speak(response);
      },
      (error) => {
        console.error('Error al obtener el número de periodos:', error);
        this.responseText = '⚠️ Hubo un error al obtener la cantidad de periodos.';
        this.speak(this.responseText);
      }
    );
  }
  
  getPeriodosInactivos() {
    this.periodoService.getPeriodosInactivos().subscribe(
      (count) => {
        const response = `Tienes ${count} periodos inactivos.`;
        console.log(response);
        this.responseText = response;
        this.speak(response);
      },
      (error) => {
        console.error('Error al obtener los periodos inactivos:', error);
        this.responseText = '⚠️ Hubo un error al obtener los periodos inactivos.';
        this.speak(this.responseText);
      }
    );
  }
  
  getPeriodosActivos() {
    this.periodoService.getPeriodosActivos().subscribe(
      (count) => {
        const response = `Tienes ${count} periodos activos.`;
        console.log(response);
        this.responseText = response;
        this.speak(response);
      },
      (error) => {
        console.error('Error al obtener los periodos activos:', error);
        this.responseText = '⚠️ Hubo un error al obtener los periodos activos.';
        this.speak(this.responseText);
      }
    );
  }
  

  extractPeriodoData(input: string) {
    const regex = /crear periodo.*desde (\d{1,2} de \w+ de \d{4}) hasta (\d{1,2} de \w+ de \d{4})/;
    const match = input.match(regex);
  
    if (match) {
      const descripcion = "Periodo generado por voz";
      
      const fechaInicioStr = match[1].replace(/(\d{1,2}) de (\w+) de (\d{4})/, (match, p1, p2, p3) => {
        const meses = { enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06', julio: '07', agosto: '08', septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12' };
        return `${p3}-${meses[p2.toLowerCase()]}-${p1.padStart(2, '0')}`;
      });
  
      const fechaFinStr = match[2].replace(/(\d{1,2}) de (\w+) de (\d{4})/, (match, p1, p2, p3) => {
        const meses = { enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06', julio: '07', agosto: '08', septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12' };
        return `${p3}-${meses[p2.toLowerCase()]}-${p1.padStart(2, '0')}`;
      });
      
      const fechaInicio = new Date(fechaInicioStr);
      const fechaFin = new Date(fechaFinStr);
      
      if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
        this.responseText = '⚠️ Las fechas proporcionadas no son válidas.';
        return null;
      }
  
      return { descripcion, fechaInicio, fechaFin, activo: true };
    }
    return null;
  }
  
  generateRandomDate(startYear: number, endYear: number): Date {
    const startDate = new Date(startYear, 0, 1); 
    const endDate = new Date(endYear, 11, 31); 
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    return randomDate;
  }
  
generateRandomYear(startYear: number, endYear: number): number {
  return Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
}

createPeriodo() {

  const fechaInicio = this.generateRandomDate(2020, 2025); 
  const fechaFin = new Date(fechaInicio.getTime() + Math.random() * (90 * 24 * 60 * 60 * 1000)); // Fecha de fin aleatoria (1 a 3 meses después)

  const randomYear = this.generateRandomYear(2020, 2025); 
  const descripcion = `${randomYear}`; 

  const periodo: Periodo = {
    idPeriodo: 0,
    descripcion: descripcion,
    fechaInicio: fechaInicio,
    fechaFin: fechaFin,
    activo: true,
  };

  this.periodoService.create(periodo).subscribe(
    (response: any) => {
      this.responseText = `Nuevo periodo creado: ${response.descripcion}`;
      this.speak(this.responseText);
    },
    (error) => {
      console.error('Error al crear el periodo:', error);
      this.responseText = '⚠️ No se pudo crear el periodo.';
      this.speak(this.responseText);
    }
  );
}
  

sendToAI(input: string) {
  if (!input.trim()) return;

  const payload = {
    contents: [{ parts: [{ text: input }] }]
  };

  this.http.post(this.apiUrl, payload, { headers: { 'Content-Type': 'application/json' } })
    .subscribe(
      (response: any) => {
        if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
          this.responseText = response.candidates[0].content.parts[0].text;
          this.speak(this.responseText);
        } else {
          this.responseText = '⚠️ No se recibió una respuesta válida de la IA.';
        }
      },
      (error) => {
        console.error('Error al conectar con la IA:', error);
        this.responseText = '⚠️ Hubo un error al conectar con la IA.';
      }
    );
}
enterHoboPlatform() {
  this.isInHoboPlatform = true;  
  this.responseText = 'Has entrado a la plataforma "El Hobo". ¿En qué puedo ayudarte?';
  this.speak(this.responseText);
}
exitHoboPlatform() {
  this.isInHoboPlatform = false;
  this.responseText = 'Has salido de la plataforma "El Hobo".';
  this.speak(this.responseText);
}


  speak(text: string) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      speechSynthesis.speak(utterance);
    } else {
      console.warn('La síntesis de voz no está soportada en este navegador.');
    }
  }

  stopAI() {
    if (this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    }

    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }

    this.responseText = 'IA detenida.';
  }
}
