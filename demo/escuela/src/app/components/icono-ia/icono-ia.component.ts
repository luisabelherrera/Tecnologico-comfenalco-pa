import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PeriodoService } from 'src/app/services/periodo/periodo.service';
import { Periodo } from 'src/app/models/entity/Periodo.interface';
import { Router } from '@angular/router'; // Para navegar

// Nueva interfaz para extender Periodo con propiedades temporales
interface PeriodoCreationData extends Partial<Periodo> {
  diaInicio?: number;
  mesInicio?: number;
  diaFin?: number;
  mesFin?: number;
}

@Component({
  selector: 'app-icono-ia',
  templateUrl: './icono-ia.component.html',
  styleUrls: ['./icono-ia.component.scss'],
})
export class IconoIaComponent {
  userInput: string = '';
  responseText: string = 'Esperando comando...'; // Valor inicial para debug
  private apiKey: string = 'AIzaSyB9HNN9nYfHK07TlZiCjMG-qVXZ2u70Rxc';
  private apiUrl: string = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`;
  isInStudentPlatform: boolean = false;
  recognition: any;
  isRecording: boolean = false;
  isInHoboPlatform: boolean = true; // Por defecto, siempre estamos en "El Hobo"
  userRole: string = 'administrador'; // Rol predeterminado para el usuario
  chatHistory: { sender: 'user' | 'ai'; message: string; timestamp: Date }[] = [];
  // Estado para el flujo de creación de periodo
  periodoCreationState: 'none' | 'askingYear' | 'askingDay' | 'askingMonth' | 'askingEndYear' | 'askingEndDay' | 'askingEndMonth' | 'complete' = 'none';
  periodoData: PeriodoCreationData = {
    descripcion: 'Periodo generado por voz en El Hobo',
    activo: true,
  };

  constructor(
    private http: HttpClient,
    private periodoService: PeriodoService,
    private router: Router // Inyectamos Router para navegación
  ) {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.lang = 'es-ES';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      // Manejar el final de la grabación
      this.recognition.onend = () => {
        this.isRecording = false;
        console.log('Grabación finalizada. Estado actual:', this.periodoCreationState);
        if (this.periodoCreationState !== 'none' && this.periodoCreationState !== 'complete') {
          this.recognition.start(); // Reinicia automáticamente si estamos en un flujo interactivo
        }
      };
    } else {
      console.warn('El reconocimiento de voz no está soportado en este navegador.');
      this.responseText = 'El reconocimiento de voz no está soportado.';
    }
  }

  startVoiceRecognition() {
    if (this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
      this.responseText = 'Grabación detenida.';
    } else {
      try {
        this.recognition.start();
        this.isRecording = true;
        this.responseText = 'Escuchando...';
      } catch (error) {
        console.error('Error al iniciar el reconocimiento de voz:', error);
        this.responseText = 'Error al iniciar el reconocimiento.';
      }
    }

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      console.log('Texto reconocido:', transcript);

      if (this.periodoCreationState === 'none') {
        if (transcript.includes("crear periodo")) {
          this.startPeriodoCreation();
        } else if (transcript.includes("cuántos periodos tengo")) {
          this.getPeriodosCount();
        } else if (transcript.includes("cuántos periodos inactivos tengo")) {
          this.getPeriodosInactivos();
        } else if (transcript.includes("cuántos periodos activos tengo")) {
          this.getPeriodosActivos();
        } else if (this.isInStudentPlatform) {
          this.handleStudentPlatformQuery(transcript);
        } else {
          this.handlePlatformQuery(transcript);
        }
      } else {
        this.handlePeriodoCreationFlow(transcript);
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Error en reconocimiento:', event.error);
      this.responseText = 'Error en el reconocimiento.';
      this.isRecording = false;
      this.recognition.start(); // Intenta reiniciar en caso de error
    };
  }

  startPeriodoCreation() {
    this.periodoCreationState = 'askingYear';
    this.responseText = 'Como administrador en El Hobo, ¿en qué año quieres que inicie el periodo?';
    this.speak(this.responseText);
    this.isRecording = true;
    this.recognition.start();
  }

  handlePeriodoCreationFlow(transcript: string) {
    console.log('Estado actual del flujo:', this.periodoCreationState);
    if (this.periodoCreationState === 'askingYear') {
      const yearMatch = transcript.match(/\d{4}/); // Captura un año de 4 dígitos
      if (yearMatch) {
        this.periodoData.descripcion = `Periodo ${yearMatch[0]} en El Hobo`;
        this.periodoCreationState = 'askingDay';
        this.responseText = `Año ${yearMatch[0]}. ¿Qué día?`;
        this.speak(this.responseText);
      } else {
        this.responseText = 'No entendí el año. Dime un año, como 2025.';
        this.speak(this.responseText);
      }
    } else if (this.periodoCreationState === 'askingDay') {
      const dayMatch = transcript.match(/\d{1,2}/); // Captura un día (1-31)
      if (dayMatch && parseInt(dayMatch[0]) >= 1 && parseInt(dayMatch[0]) <= 31) {
        this.periodoData.diaInicio = parseInt(dayMatch[0]);
        this.periodoCreationState = 'askingMonth';
        this.responseText = `Día ${dayMatch[0]}. ¿Qué mes?`;
        this.speak(this.responseText);
      } else {
        this.responseText = 'No entendí el día. Dime un número entre 1 y 31.';
        this.speak(this.responseText);
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
        this.responseText = `Mes ${month}. ¿En qué año quieres que finalice el periodo?`;
        this.speak(this.responseText);
      } else {
        this.responseText = 'No entendí el mes. Dime un mes, como enero o febrero.';
        this.speak(this.responseText);
      }
    } else if (this.periodoCreationState === 'askingEndYear') {
      const yearMatch = transcript.match(/\d{4}/); // Captura un año de 4 dígitos
      if (yearMatch) {
        this.periodoData.descripcion = `Periodo desde ${this.periodoData.descripcion.split(' ')[1]} hasta ${yearMatch[0]} en El Hobo`;
        this.periodoCreationState = 'askingEndDay';
        this.responseText = `Año ${yearMatch[0]}. ¿Qué día de finalización?`;
        this.speak(this.responseText);
      } else {
        this.responseText = 'No entendí el año. Dime un año, como 2025.';
        this.speak(this.responseText);
      }
    } else if (this.periodoCreationState === 'askingEndDay') {
      const dayMatch = transcript.match(/\d{1,2}/); // Captura un día (1-31)
      if (dayMatch && parseInt(dayMatch[0]) >= 1 && parseInt(dayMatch[0]) <= 31) {
        this.periodoData.diaFin = parseInt(dayMatch[0]);
        this.periodoCreationState = 'askingEndMonth';
        this.responseText = `Día ${dayMatch[0]}. ¿Qué mes de finalización?`;
        this.speak(this.responseText);
      } else {
        this.responseText = 'No entendí el día. Dime un número entre 1 y 31.';
        this.speak(this.responseText);
      }
    } else if (this.periodoCreationState === 'askingEndMonth') {
      const monthMap: { [key: string]: number } = {
        enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
        julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
      };
      const month = Object.keys(monthMap).find(m => transcript.includes(m));
      if (month) {
        this.periodoData.mesFin = monthMap[month];
        this.completePeriodoCreation();
      } else {
        this.responseText = 'No entendí el mes. Dime un mes, como enero o febrero.';
        this.speak(this.responseText);
      }
    }
    // No reiniciamos la grabación aquí; dejamos que onend lo maneje
  }

  completePeriodoCreation() {
    if (this.periodoData.descripcion && this.periodoData.diaInicio && this.periodoData.mesInicio && this.periodoData.diaFin && this.periodoData.mesFin) {
      const [startYear] = this.periodoData.descripcion.match(/\d{4}/) || [];
      const [endYear] = this.periodoData.descripcion.match(/\d{4}(?=\s+en)/) || [];
      
      if (!startYear || !endYear) {
        this.responseText = 'No se pudo determinar los años del periodo en El Hobo.';
        this.speak(this.responseText);
        this.resetPeriodoCreation();
        return;
      }

      const fechaInicio = new Date(parseInt(startYear), this.periodoData.mesInicio, this.periodoData.diaInicio);
      const fechaFin = new Date(parseInt(endYear), this.periodoData.mesFin, this.periodoData.diaFin);

      // Validar que las fechas sean válidas y que fechaInicio sea anterior a fechaFin
      if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime()) || fechaInicio >= fechaFin) {
        this.responseText = 'Las fechas proporcionadas no son válidas o el periodo de inicio es posterior al fin en El Hobo.';
        this.speak(this.responseText);
        this.resetPeriodoCreation();
        return;
      }

      const periodo: Periodo = {
        idPeriodo: 0, // El backend generará este ID
        descripcion: this.periodoData.descripcion,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        activo: this.periodoData.activo || true,
      };

      this.responseText = `Abriendo formulario para crear el periodo en El Hobo desde el ${fechaInicio.toLocaleDateString()} hasta el ${fechaFin.toLocaleDateString()} como administrador...`;
      this.speak(this.responseText);
      this.isRecording = false;
      this.recognition.stop(); // Aseguramos que la grabación se detenga antes de navegar

      // Navegar a PeriodoComponent con los datos recopilados
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
        this.responseText = 'Error al navegar al formulario de periodo en El Hobo.';
        this.speak(this.responseText);
      });

      this.resetPeriodoCreation();
    }
  }

  resetPeriodoCreation() {
    this.periodoCreationState = 'none';
    this.periodoData = {
      descripcion: 'Periodo generado por voz en El Hobo',
      activo: true,
    };
  }

  navigateToCreatePeriodo(transcript: string) {
    // Esta función ya no se usa directamente, pero la dejamos por compatibilidad
    this.startPeriodoCreation(); // Inicia el flujo interactivo en su lugar
  }

  handleStudentPlatformQuery(query: string) {
    if (this.isInHoboPlatform) {
      const periodPattern = /qué puedo hacer con este periodo|qué tengo que hacer en este periodo/i;
      if (periodPattern.test(query)) {
        this.responseText = 'Como administrador en El Hobo, con este periodo puedes gestionar tareas, calificaciones y actividades para los estudiantes.';
        this.speak(this.responseText);
      } else {
        this.handlePlatformQuery(query); // Reutilizamos la lógica de "El Hobo"
      }
    }
  }

  handlePlatformQuery(query: string) {
    if (this.isInHoboPlatform) {
      if (query.includes("hago en la plataforma")) {
        this.responseText = `Como administrador en la plataforma "El Hobo", puedes gestionar usuarios, periodos, estudiantes, docentes y más. ¿En qué puedo ayudarte?`;
        this.speak(this.responseText);
      } else if (query.includes("ver mi progreso")) {
        this.responseText = `Como administrador en "El Hobo", puedes consultar el progreso de los estudiantes o gestionar configuraciones del sistema.`;
        this.speak(this.responseText);
      } else if (query.includes("quién soy")) {
        this.responseText = `Eres un administrador en la plataforma escolar "El Hobo". ¿Qué necesitas gestionar?`;
        this.speak(this.responseText);
      } else {
        this.sendToAI(query, this.userRole, 'El Hobo'); // Envía contexto a la IA
      }
    } else {
      this.responseText = `No entiendo: "${query}"`;
      this.speak(this.responseText);
      this.sendToAI(query, this.userRole, 'El Hobo'); // Envía contexto a la IA
    }
  }

  enterStudentPlatform() {
    this.isInStudentPlatform = true;
    this.responseText = 'Estás en la plataforma estudiantil de El Hobo como administrador. ¿En qué puedo ayudarte con tus tareas administrativas?';
    this.speak(this.responseText);
  }

  exitStudentPlatform() {
    this.isInStudentPlatform = false;
    this.responseText = 'Has salido de la plataforma estudiantil de El Hobo.';
    this.speak(this.responseText);
  }

  getPeriodosCount() {
    this.periodoService.getPeriodosCount().subscribe(
      (count) => {
        const response = `Tienes ${count} periodos en total en El Hobo como administrador.`;
        console.log(response);
        this.responseText = response;
        this.speak(response);
      },
      (error) => {
        console.error('Error al obtener el número de periodos:', error);
        this.responseText = 'Error al obtener la cantidad de periodos en El Hobo.';
        this.speak(this.responseText);
      }
    );
  }

  getPeriodosInactivos() {
    this.periodoService.getPeriodosInactivos().subscribe(
      (count) => {
        const response = `Tienes ${count} periodos inactivos en El Hobo como administrador.`;
        console.log(response);
        this.responseText = response;
        this.speak(response);
      },
      (error) => {
        console.error('Error al obtener los periodos inactivos:', error);
        this.responseText = 'Error al obtener los periodos inactivos en El Hobo.';
        this.speak(this.responseText);
      }
    );
  }

  getPeriodosActivos() {
    this.periodoService.getPeriodosActivos().subscribe(
      (count) => {
        const response = `Tienes ${count} periodos activos en El Hobo como administrador.`;
        console.log(response);
        this.responseText = response;
        this.speak(response);
      },
      (error) => {
        console.error('Error al obtener los periodos activos:', error);
        this.responseText = 'Error al obtener los periodos activos en El Hobo.';
        this.speak(this.responseText);
      }
    );
  }

  extractPeriodoData(input: string) {
    // Esta función ya no se usa directamente, pero la dejamos por compatibilidad
    return null;
  }

  generateRandomDate(startYear: number, endYear: number): Date {
    const startDate = new Date(startYear, 0, 1);
    const endDate = new Date(endYear, 11, 31);
    return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
  }

  generateRandomYear(startYear: number, endYear: number): number {
    return Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  }

  // Esta función ya no se usa directamente, pero la dejamos por si quieres fallback
  createPeriodo() {
    const fechaInicio = this.generateRandomDate(2020, 2025);
    const fechaFin = new Date(fechaInicio.getTime() + Math.random() * (90 * 24 * 60 * 60 * 1000));
    const randomYear = this.generateRandomYear(2020, 2025);
    const descripcion = `${randomYear} en El Hobo`;

    const periodo: Periodo = {
      idPeriodo: 0,
      descripcion: descripcion,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      activo: true,
    };

    this.periodoService.create(periodo).subscribe(
      (response: any) => {
        this.responseText = `Nuevo periodo creado en El Hobo: ${response.descripcion}`;
        this.speak(this.responseText);
      },
      (error) => {
        console.error('Error al crear el periodo en El Hobo:', error);
        this.responseText = 'No se pudo crear el periodo en El Hobo.';
        this.speak(this.responseText);
      }
    );
  }

  sendToAI(input: string, role: string = 'administrador', platform: string = 'El Hobo') {
    if (!input.trim()) return;

    const context = `Estás interactuando con un ${role} en la plataforma escolar "${platform}". Responde como un asistente útil y profesional. Pregunta: ${input}`;
    const payload = {
      contents: [{ parts: [{ text: context }] }],
    };

    this.http.post(this.apiUrl, payload, { headers: { 'Content-Type': 'application/json' } })
      .subscribe(
        (response: any) => {
          if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
            this.responseText = response.candidates[0].content.parts[0].text;
            this.speak(this.responseText);
          } else {
            this.responseText = 'No se recibió una respuesta válida de la IA en El Hobo.';
          }
        },
        (error) => {
          console.error('Error al conectar con la IA en El Hobo:', error);
          this.responseText = 'Error al conectar con la IA en El Hobo.';
        }
      );
  }

  enterHoboPlatform() {
    // No es necesario cambiar, ya que isInHoboPlatform es true por defecto
    this.responseText = 'Estás en la plataforma "El Hobo" como administrador. ¿En qué puedo ayudarte?';
    this.speak(this.responseText);
  }
  private addToChatHistory(sender: 'user' | 'ai', message: string) {
    this.chatHistory.push({
      sender,
      message,
      timestamp: new Date(),
    });
  }
  exitHoboPlatform() {
    this.isInHoboPlatform = false;
    this.responseText = 'Has salido de la plataforma "El Hobo".';
    this.speak(this.responseText);
    this.addToChatHistory('ai', this.responseText);
  }

  speak(text: string) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      const voiceIndicator = document.querySelector('.voice-indicator');
      if (voiceIndicator) voiceIndicator.classList.add('active');
      utterance.onend = () => {
        if (voiceIndicator) voiceIndicator.classList.remove('active');
      };
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
      const voiceIndicator = document.querySelector('.voice-indicator');
      if (voiceIndicator) voiceIndicator.classList.remove('active');
    }
    this.responseText = 'IA detenida en El Hobo.';
  }
}