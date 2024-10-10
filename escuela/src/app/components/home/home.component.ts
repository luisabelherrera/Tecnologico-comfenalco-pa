import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output} from '@angular/core';


interface GenerateContentResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}
interface Message {
  content: string;
  timestamp: Date;
  sentByUser: boolean;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  text: string = '';
  response: string | null = null;
  isLoading: boolean = false;
  newMessage: string = '';
  messages: Message[] = [];

  @Output() contentGenerated = new EventEmitter<string>();

  constructor(private http: HttpClient) {}

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      // Agregar el mensaje a la lista de mensajes enviados
      this.messages.push({
        content: this.newMessage,
        timestamp: new Date(),
        sentByUser: true,
      });

      // Limpiar el input
      this.newMessage = '';

      // Simular una respuesta automática después de un retraso
      setTimeout(() => {
        this.receiveMessage('Esta es una respuesta automática');
      }, 1000);
    }
  }

  receiveMessage(content: string) {
    this.messages.push({
      content: content,
      timestamp: new Date(),
      sentByUser: false,
    });
  }


  generateContent(): void {
    this.isLoading = true;
    const apiKey = 'AIzaSyAQm3Xcp6dIoFtmnKXmUEsKOoKlbH91I4c';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    this.http.post<GenerateContentResponse>(url, {
      contents: [
        {
          parts: [
            {
              text: this.text
            }
          ]
        }
      ]
    }).subscribe({
      next: (result) => {
        this.response = result.candidates[0]?.content?.parts[0]?.text || 'No response received';
        this.isLoading = false;
        this.contentGenerated.emit(this.response);  // Emit the generated content
      },
      error: (error) => {
        console.error('Error generating content:', error);
        this.response = 'An error occurred while generating content.';
        this.isLoading = false;
        this.contentGenerated.emit(this.response);  // Emit the error message
      }
    });
  }
}
