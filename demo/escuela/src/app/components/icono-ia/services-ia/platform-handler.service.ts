import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatHistoryService } from './chat-history.service';
import { API_URL } from '../constants-ia/api.constants';

@Injectable({
  providedIn: 'root',
})
export class PlatformHandlerService {
  constructor(
    private http: HttpClient,
    private chatHistoryService: ChatHistoryService
  ) {}

  handlePlatformQuery(query: string, isInHoboPlatform: boolean, userRole: string, speak: (text: string) => void): boolean {
    if (isInHoboPlatform) {
      const responseText = this.handlePlatformSpecificQueries(query);
      if (responseText) {
        speak(responseText);
        this.chatHistoryService.addToChatHistory('ai', responseText);
        return true;
      } else {
        this.sendToAI(query, userRole, 'EduPortal', speak);
        return true;
      }
    } else {
      const responseText = `No entiendo: "${query}"`;
      speak(responseText);
      this.chatHistoryService.addToChatHistory('ai', responseText);
      this.sendToAI(query, userRole, 'EduPortal', speak);
      return true;
    }
  }

  private handlePlatformSpecificQueries(query: string): string | null {
    if (query.includes("hago en la plataforma")) {
      return `Como administrador en la plataforma "EduPortal", puedes gestionar usuarios, periodos, estudiantes, docentes y más. ¿En qué puedo ayudarte?`;
    } else if (query.includes("ver mi progreso")) {
      return `Como administrador en "EduPortal", puedes consultar el progreso de los estudiantes o gestionar configuraciones del sistema.`;
    } else if (query.includes("quién soy")) {
      return `Eres un administrador en la plataforma escolar "EduPortal". ¿Qué necesitas gestionar?`;
    }
    return null;
  }

  enterHoboPlatform(speak: (text: string) => void): void {
    const responseText = 'Estás en la plataforma "El Hobo" como administrador. ¿En qué puedo ayudarte?';
    speak(responseText);
    this.chatHistoryService.addToChatHistory('ai', responseText);
  }

  exitHoboPlatform(speak: (text: string) => void): void {
    const responseText = 'Has salido de la plataforma "El Hobo".';
    speak(responseText);
    this.chatHistoryService.addToChatHistory('ai', responseText);
  }

  private sendToAI(input: string, role: string, platform: string, speak: (text: string) => void): void {
    if (!input.trim()) return;

    const context = `Estás interactuando con un ${role} en la plataforma escolar "${platform}". Responde como un asistente útil y profesional. Pregunta: ${input}`;
    const payload = {
      contents: [{ parts: [{ text: context }] }],
    };

    this.http.post(API_URL, payload, { headers: { 'Content-Type': 'application/json' } })
      .subscribe(
        (response: any) => {
          if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
            const responseText = response.candidates[0].content.parts[0].text;
            speak(responseText);
            this.chatHistoryService.addToChatHistory('ai', responseText);
          } else {
            const responseText = 'No se recibió una respuesta válida de la IA en El Hobo.';
            speak(responseText);
            this.chatHistoryService.addToChatHistory('ai', responseText);
          }
        },
        (error) => {
          console.error('Error al conectar con la IA en El Hobo:', error);
          const responseText = 'Error al conectar con la IA en El Hobo.';
          speak(responseText);
          this.chatHistoryService.addToChatHistory('ai', responseText);
        }
      );
  }
}
