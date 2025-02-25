import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Calificacion } from 'src/app/models/entity/Calificacion.interface';
import { CalificacionService } from 'src/app/services/calificacion/calificacion.service';
import { EstudiantePerfilService } from 'src/app/services/estudiante/ventana-estudiante/estudiante-perfil.service';
import { SuggestionsDialogComponent } from '../../generate-ia/suggestions-dialog/suggestions-dialog.component';
import { UserDto } from 'src/app/models/models';

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
  selector: 'app-ventana3',
  templateUrl: './ventana3.component.html',
  styleUrls: ['./ventana3.component.scss']
})
export class Ventana3Component implements OnInit {
  estudiante?: UserDto;
  calificaciones: Calificacion[] = [];
  today: Date = new Date();
  constructor(
    private calificacionService: CalificacionService,
    private estudiantePerfilService: EstudiantePerfilService,
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadEstudianteYCalificaciones();
  }

  loadEstudianteYCalificaciones(): void {
    this.estudiantePerfilService.getPerfilEstudiante().subscribe(
      (data) => {
        this.estudiante = data;
        this.loadCalificaciones();
      },
      (error) => {
        console.error('Error al obtener el perfil del estudiante:', error);
      }
    );
  }

  loadCalificaciones(): void {
    if (!this.estudiante?.estudiante?.idEstudiante) return;

    this.calificacionService.getCalificaciones().subscribe(
      (data) => {
        this.calificaciones = data.filter(
          (calificacion) => calificacion.estudiante.idEstudiante === this.estudiante?.estudiante?.idEstudiante
        );
      },
      (error) => {
        console.error('Error loading grades', error);
      }
    );
  }

  printBoletin(): void {
    window.print(); // Abre el diálogo de impresión del navegador
  }

  requestSuggestionsForCalificacion(calificacion: Calificacion): void {
    const grade = calificacion.nota;
    const curricularDescription = calificacion.curricular.descripcion;
    if (grade < 0 || grade > 5) {
      console.error('La nota debe estar entre 0 y 5.');
      this.openSuggestionsDialog('La nota debe estar entre 0 y 5.');
      return;
    }
    this.requestSuggestions(grade, curricularDescription);
  }

  requestSuggestions(grade: number, curricularDescription: string): void {
    const apiKey = 'AIzaSyB9HNN9nYfHK07TlZiCjMG-qVXZ2u70Rxc';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

    const prompt = `Con base en la nota actual de ${grade} y la descripción curricular: "${curricularDescription}", por favor proporciona sugerencias en español para mejorar el rendimiento.`;

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
        console.log('Resultado de la API:', result);
        const suggestions = result.candidates[0]?.content?.parts[0]?.text
          ?.replace(/{|}/g, '')
          ?.replace(/^•/gm, '✨')
          ?.replace(/^(\*\*.*?\*\*)/gm, '🔥 $1')
          ?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        this.openSuggestionsDialog(suggestions || '⚠️ No se recibió respuesta.');
      },
      error: (error) => {
        console.error('Error al generar sugerencias:', error);
        this.openSuggestionsDialog('❌ Ocurrió un error al generar las sugerencias.');
      }
    });
  }

  openSuggestionsDialog(suggestions: string): void {
    this.dialog.open(SuggestionsDialogComponent, {
      width: '500px',
      data: { suggestions: suggestions }
    });
  }
}