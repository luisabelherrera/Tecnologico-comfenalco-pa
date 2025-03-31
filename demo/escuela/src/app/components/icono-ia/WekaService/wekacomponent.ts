import { Component, Input } from '@angular/core';

import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WekaService } from './weka.service';

@Component({
  selector: 'app-weka',
  template: `
 <div *ngIf="activate">
      <p>Weka está activo</p>
      <!-- Aquí puedes agregar más contenido relacionado con Weka -->
    </div>
  `,
  styles: [`
    .weka-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #fff;
      padding: 10px;
      border-radius: 5px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 1000;
    }
  `]
})
export class WekaComponent {
    
  @Input() set activate(value: boolean) {
    if (value) {
      this.isActive = true;
      this.startListening();
    } else {
      this.isActive = false;
      this.stopListening();
    }
  }

  isActive: boolean = false;
  responseText: string = 'Esperando comando...';
  recognition: any;
  private subscription: Subscription = new Subscription();

  constructor(
    private wekaService: WekaService,
    private router: Router
  ) {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.lang = 'es-ES';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onend = () => {
        console.log('Weka - Grabación finalizada.');
        if (this.isActive) {
          this.startListening(); // Keep listening while active
        }
      };
    } else {
      console.warn('El reconocimiento de voz no está soportado en este navegador.');
      this.responseText = 'El reconocimiento de voz no está soportado.';
      this.speak(this.responseText);
    }
  }

  startListening() {
    if (!this.recognition) return;

    this.responseText = 'Escuchando...';
    this.speak('Dime qué quieres hacer.');

    try {
      this.recognition.start();
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        console.log('Weka - Texto reconocido:', transcript);
        this.handleWekaQuery(transcript);
      };

      this.recognition.onerror = (event: any) => {
        console.error('Weka - Error en reconocimiento:', event.error);
        this.responseText = 'Error en el reconocimiento.';
        this.speak(this.responseText);
      };
    } catch (error) {
      console.error('Weka - Error al iniciar el reconocimiento de voz:', error);
      this.responseText = 'Error al iniciar el reconocimiento.';
      this.speak(this.responseText);
    }
  }

  stopListening() {
    if (this.recognition) {
      this.recognition.stop();
    }
    this.responseText = 'Weka detenido.';
    this.speak(this.responseText);
  }

  private handleWekaQuery(transcript: string) {
    this.subscription.add(
      this.wekaService.predictIntention(transcript).subscribe({
        next: (response) => {
          console.log('Weka - Respuesta completa de Weka:', response);
          const predictedIntention = response.intencion;
          console.log('Weka - 🎯 Intención predicha por Weka:', predictedIntention);

          switch (predictedIntention) {
            case 'crear_periodo':
            case 'periodo': // Handle both "crear periodo" and "periodo"
              this.responseText = 'Dirigiéndote a la página de periodos...';
              this.speak(this.responseText);
              this.router.navigate(['/periodo']);
              break;
            default:
              this.responseText = 'Lo siento, no entendí tu solicitud.';
              this.speak(this.responseText);
          }
        },
        error: (err) => {
          console.error('Weka - ❌ Error al comunicarse con Weka:', err);
          this.responseText = 'Hubo un error al procesar tu solicitud.';
          this.speak(this.responseText);
        }
      })
    );
  }

  private speak(text: string) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      speechSynthesis.speak(utterance);
    } else {
      console.warn('La síntesis de voz no está soportada.');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.stopListening();
  }
}