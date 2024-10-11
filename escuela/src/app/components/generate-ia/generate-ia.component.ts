// src/app/generate-content/generate-content.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface GenerateContentResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

@Component({
  selector: 'app-generate-content',
  templateUrl: './generate-ia.component.html',
  styleUrls: ['./generate-ia.component.scss']
})



export class GenerateContentComponent {
  text: string = '';
  grade: number | null = null; // Property for grade
  response: string | null = null;
  isLoading: boolean = false;
  
  @Output() contentGenerated = new EventEmitter<string>();

  constructor(private http: HttpClient) {}

  generateContent(): void {
    if (this.grade === null) {
      alert('Por favor, introduce tu nota actual.');
      return;
    }
  
    this.isLoading = true;
    const apiKey = 'YOUR_API_KEY_HERE'; // Reemplaza con tu clave API real
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
  
    const prompt = `Con base en la nota actual de ${this.grade}, ${this.text}. Por favor, proporciona sugerencias en español para mejorar la calificación.`; // Solicitud de sugerencias en español
  
    this.http.post<GenerateContentResponse>(url, {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    }).subscribe({
      next: (result) => {
        this.response = result.candidates[0]?.content?.parts[0]?.text || 'No se recibió respuesta';
        this.isLoading = false;
        this.contentGenerated.emit(this.response); // Emitir el contenido generado
      },
      error: (error) => {
        console.error('Error al generar contenido:', error);
        this.response = 'Ocurrió un error al generar el contenido.';
        this.isLoading = false;
        this.contentGenerated.emit(this.response); // Emitir el mensaje de error
      }
    });
  }
}  