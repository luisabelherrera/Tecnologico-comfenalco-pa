import { Injectable } from '@angular/core';
import { ChatHistoryService } from './chat-history.service';

@Injectable({
  providedIn: 'root',
})
export class StudentHandlerService {
  constructor(private chatHistoryService: ChatHistoryService) {}

  /**
   * Maneja las consultas relacionadas con la plataforma estudiantil.
   * @param query La consulta del usuario.
   * @param isInHoboPlatform Indica si estamos en la plataforma de Hobo.
   * @param speak Función para que la IA hable.
   * @returns Verdadero si la consulta se maneja correctamente, falso en caso contrario.
   */
  handleStudentPlatformQuery(query: string, isInHoboPlatform: boolean, speak: (text: string) => void): boolean {
    if (isInHoboPlatform) {
      const periodPattern = /qué puedo hacer con este periodo|qué tengo que hacer en este periodo/i;
      if (periodPattern.test(query)) {
        const responseText = 'Como administrador en EduPortal, con este periodo puedes gestionar tareas, calificaciones y actividades para los estudiantes.';
        speak(responseText);
        this.chatHistoryService.addToChatHistory('ai', responseText);
        return true;
      }
    }
    return false;
  }

  /**
   * Entra en la plataforma estudiantil de El Hobo y proporciona un mensaje de bienvenida.
   * @param speak Función para que la IA hable.
   */
  enterStudentPlatform(speak: (text: string) => void): void {
    const responseText = 'Estás en la plataforma estudiantil de El Hobo como administrador. ¿En qué puedo ayudarte con tus tareas administrativas?';
    speak(responseText);
    this.chatHistoryService.addToChatHistory('ai', responseText);
  }

  /**
   * Sale de la plataforma estudiantil de El Hobo y proporciona un mensaje de despedida.
   * @param speak Función para que la IA hable.
   */
  exitStudentPlatform(speak: (text: string) => void): void {
    const responseText = 'Has salido de la plataforma estudiantil de El Hobo.';
    speak(responseText);
    this.chatHistoryService.addToChatHistory('ai', responseText);
  }
}
