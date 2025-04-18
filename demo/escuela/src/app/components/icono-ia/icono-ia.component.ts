import { Component } from '@angular/core';
import { ChatMessage } from './models-ia/chat-message.interface';
import { ChatHistoryService } from './services-ia/chat-history.service';
import { PlatformHandlerService } from './services-ia/platform-handler.service';
import { StudentHandlerService } from './services-ia/student-handler.service';
import { Router } from '@angular/router';
import { WekaService } from './WekaService/weka.service';
import { GeminiService } from './constants-ia/constants-ia';
import { PeriodoHandlerService } from './services-ia/periodo-handler.service';

@Component({
  selector: 'app-icono-ia',
  templateUrl: './icono-ia.component.html',
  styleUrls: ['./icono-ia.component.scss'],
})
export class IconoIaComponent {
  userInput: string = '';
  responseText: string = 'Esperando comando...';
  isInStudentPlatform: boolean = false;
  recognition: any;
  isRecording: boolean = false;
  isInHoboPlatform: boolean = true;
  userRole: string = 'administrador';
  chatHistory: ChatMessage[] = [];
  isExpanded: boolean = false;

  constructor(
    private chatHistoryService: ChatHistoryService,
    private studentHandlerService: StudentHandlerService,
    private platformHandlerService: PlatformHandlerService,
    private wekaService: WekaService,
    private geminiService: GeminiService, // Inject GeminiService
    private router: Router,
    private periodoHandlerService: PeriodoHandlerService // Inject PeriodoHandlerService
  ) {
    this.chatHistory = this.chatHistoryService.getChatHistory();
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.lang = 'es-ES';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onend = () => {
        this.isRecording = false;
        console.log('Grabación finalizada.');
      };
    } else {
      console.warn('El reconocimiento de voz no está soportado en este navegador.');
      this.responseText = 'El reconocimiento de voz no está soportado.';
      this.chatHistoryService.addToChatHistory('ai', this.responseText);
    }
  }

  startVoiceRecognition() {
    if (this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
      this.responseText = 'Grabación detenida.';
      this.chatHistoryService.addToChatHistory('ai', this.responseText);
    } else {
      try {
        this.recognition.start();
        this.isRecording = true;
        this.responseText = 'Escuchando...';
        this.chatHistoryService.addToChatHistory('ai', this.responseText);
      } catch (error) {
        console.error('Error al iniciar el reconocimiento de voz:', error);
        this.responseText = 'Error al iniciar el reconocimiento.';
        this.chatHistoryService.addToChatHistory('ai', this.responseText);
      }
    }

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      console.log('Texto reconocido:', transcript);
      this.handleQuery(transcript);
    };

    this.recognition.onerror = (event) => {
      console.error('Error en reconocimiento:', event.error);
      this.responseText = 'Error en el reconocimiento.';
      this.chatHistoryService.addToChatHistory('ai', this.responseText);
      this.isRecording = false;
    };
  }

  submitTextInput() {
    if (this.userInput.trim()) {
      this.chatHistoryService.addToChatHistory('user', this.userInput);
      console.log('Texto enviado manualmente:', this.userInput);
      const transcript = this.userInput.toLowerCase().trim();
      this.handleQuery(transcript);
      this.userInput = '';
    }
  }
private handleQuery(transcript: string) {
  const periodKeywords = ['periodo', 'periodos', 'año', 'semestre'];
  const studentKeywords = ['estudiante', 'estudiantes', 'alumno', 'alumnos'];

  if (periodKeywords.some(keyword => transcript.includes(keyword)) ||
      studentKeywords.some(keyword => transcript.includes(keyword))) {
    // Use Weka for period-related or student-related queries
    this.wekaService.predictIntention(transcript).subscribe({
      next: (response) => {
        const predictedIntention = response.intencion;
        console.log('Weka - 🎯 Intención predicha por Weka:', predictedIntention);

        switch (predictedIntention) {
          case 'crear_periodo':
          case 'periodo': {
            // Start the period creation flow
            if (!this.periodoHandlerService.handlePeriodoCreationFlow(transcript, this.speak.bind(this))) {
              // If the creation flow is not complete, do nothing
              break;
            }

            // If the creation flow is complete, navigate to the period creation page with the data
            const periodoData = this.periodoHandlerService.periodoData;
            this.responseText = 'Dirigiéndote a la página de periodos...';
            this.speak(this.responseText);
            this.router.navigate(['/periodo'], {
              queryParams: {
                action: 'crear',
                descripcion: periodoData.descripcion,
                fechaInicio: periodoData.fechaInicio?.toISOString(),
                fechaFin: periodoData.fechaFin?.toISOString(),
                activo: periodoData.activo,
              },
            });
            break;
          }
          case 'consultar_periodos':
            this.responseText = 'Mostrando los periodos...';
            this.speak(this.responseText);
            this.router.navigate(['/periodo'], { queryParams: { action: 'consultar' } });
            break;
          case 'crear_estudiante':
            this.responseText = 'Dirigiéndote a la página de creación de estudiantes...';
            this.speak(this.responseText);
            this.router.navigate(['/estudiante/crear'], { queryParams: { action: 'crear' } });
            break;
          case 'consultar_estudiantes':
            this.responseText = 'Mostrando la lista de estudiantes...';
            this.speak(this.responseText);
            this.router.navigate(['/estudiante/listar'], { queryParams: { action: 'consultar' } });
            break;
          default:
            // If Weka doesn't recognize the intent, use Gemini
            this.geminiService.generateContent(transcript).subscribe({
              next: (geminiResponse: any) => {
                this.responseText = geminiResponse.candidates[0].content.parts[0].text;
                this.speak(this.responseText);
              },
              error: (geminiError: any) => {
                console.error('Gemini - ❌ Error al comunicarse con Gemini:', geminiError);
                this.responseText = 'Lo siento, no pude obtener una respuesta.';
                this.speak(this.responseText);
              }
            });
        }
      },
      error: (wekaError) => {
        console.error('Weka - ❌ Error al comunicarse con Weka:', wekaError);
        this.responseText = 'Hubo un error al procesar tu solicitud.';
        this.speak(this.responseText);
      }
    });
  } else {
    // Use Gemini for greetings and general conversation
    if (this.isGreeting(transcript)) {
      this.geminiService.generateContent(transcript).subscribe({
        next: (geminiResponse: any) => {
          this.responseText = geminiResponse.candidates[0].content.parts[0].text;
          this.speak(this.responseText);
        },
        error: (geminiError: any) => {
          console.error('Gemini - ❌ Error al comunicarse con Gemini:', geminiError);
          this.responseText = 'Lo siento, no pude obtener una respuesta.';
          this.speak(this.responseText);
        }
      });
    } else {
      // If it's not a greeting, use Gemini
      this.geminiService.generateContent(transcript).subscribe({
        next: (geminiResponse: any) => {
          this.responseText = geminiResponse.candidates[0].content.parts[0].text;
          this.speak(this.responseText);
        },
        error: (geminiError: any) => {
          console.error('Gemini - ❌ Error al comunicarse con Gemini:', geminiError);
          this.responseText = 'Lo siento, no pude obtener una respuesta.';
          this.speak(this.responseText);
        }
      });
    }
  }
}
  // Helper function to check if the input is a greeting
  private isGreeting(text: string): boolean {
    const greetings = ['hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'que tal', 'como estas', 'como te va'];
    return greetings.some(greeting => text.includes(greeting));
  }

  enterStudentPlatform() {
    this.isInStudentPlatform = true;
    this.studentHandlerService.enterStudentPlatform(this.speak.bind(this));
  }

  exitStudentPlatform() {
    this.isInStudentPlatform = false;
    this.studentHandlerService.exitStudentPlatform(this.speak.bind(this));
  }

  enterHoboPlatform() {
    this.platformHandlerService.enterHoboPlatform(this.speak.bind(this));
  }

  exitHoboPlatform() {
    this.isInHoboPlatform = false;
    this.platformHandlerService.exitHoboPlatform(this.speak.bind(this));
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
    this.chatHistoryService.addToChatHistory('ai', text);
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
    this.responseText = 'IA detenida en Eduportal.';
    this.chatHistoryService.addToChatHistory('ai', this.responseText);
  }

  toggleChatSize() {
    if (window.innerWidth > 768) {
      this.isExpanded = !this.isExpanded;
    }
  }
}