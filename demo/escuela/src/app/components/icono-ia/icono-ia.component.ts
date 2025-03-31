import { Component } from '@angular/core';
import { ChatMessage } from './models-ia/chat-message.interface';
import { ChatHistoryService } from './services-ia/chat-history.service';
import { PlatformHandlerService } from './services-ia/platform-handler.service';
import { StudentHandlerService } from './services-ia/student-handler.service';

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
    private platformHandlerService: PlatformHandlerService
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
    if (this.isInStudentPlatform && this.studentHandlerService.handleStudentPlatformQuery(transcript, this.isInHoboPlatform, this.speak.bind(this))) {
      // La consulta fue manejada por el StudentHandlerService
      console.log('Consulta manejada por StudentHandlerService');
    } else if (this.platformHandlerService.handlePlatformQuery(transcript, this.isInHoboPlatform, this.userRole, this.speak.bind(this))) {
      // La consulta fue manejada por el PlatformHandlerService
      console.log('Consulta manejada por PlatformHandlerService');
    } else {
      this.speak('Lo siento, no entendí tu solicitud.');
    }
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
    this.responseText = 'IA detenida en El Hobo.';
    this.chatHistoryService.addToChatHistory('ai', this.responseText);
  }

  toggleChatSize() {
    if (window.innerWidth > 768) {
      this.isExpanded = !this.isExpanded;
    }
  }
}