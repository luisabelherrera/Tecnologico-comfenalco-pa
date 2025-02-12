import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  recognition: any;
  isRecording: boolean = false;

  constructor(private http: HttpClient) {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.lang = 'es-ES';
      this.recognition.interimResults = false; 
      this.recognition.maxAlternatives = 1; 

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.userInput = transcript; 
        this.sendToAI(); 
      };

      this.recognition.onerror = (event: any) => {
        console.error('Error en el reconocimiento de voz:', event.error);
        this.responseText = '⚠️ Hubo un error al procesar el audio.';
      };
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
      this.recognition.start(); 
      this.isRecording = true;
    }
  }

  sendToAI() {
    if (!this.userInput.trim()) return;

    const payload = {
      contents: [
        {
          parts: [{ text: this.userInput }]
        }
      ]
    };

    this.http
      .post(this.apiUrl, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .subscribe(
        (response: any) => {
          if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
            this.responseText = response.candidates[0].content.parts[0].text;
            this.speakResponse(this.responseText); 
          } else {
            this.responseText = '⚠️ No se recibió una respuesta válida de la IA.';
          }
        },
        (error) => {
          console.error('Error al conectar con Gemini:', error);
          this.responseText = '⚠️ Hubo un error al conectar con la IA.';
        }
      );
  }

  speakResponse(text: string) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      speechSynthesis.speak(utterance);
    } else {
      console.warn('La síntesis de voz no está soportada en este navegador.');
    }
  }
}
