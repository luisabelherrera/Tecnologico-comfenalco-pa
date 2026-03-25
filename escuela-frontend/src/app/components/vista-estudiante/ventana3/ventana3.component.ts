import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Calificacion } from 'src/app/models/entity/Calificacion.interface';
import { Horario } from 'src/app/models/entity/horario.model';
import { CalificacionService } from 'src/app/services/calificacion/calificacion.service';
import { EstudiantePerfilService } from 'src/app/services/estudiante/ventana-estudiante/estudiante-perfil.service';
import { SuggestionsDialogComponent } from '../../generate-ia/suggestions-dialog/suggestions-dialog.component';
import { UserDto } from 'src/app/models/models';
import { HorarioService } from 'src/app/services/horario/Horario.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  horarios: Horario[] = []; // Lista de horarios
  today: Date = new Date();

  @ViewChild('printBoletinContent') printBoletinContent!: ElementRef; // Referencia al contenedor del boletín

  constructor(
    private calificacionService: CalificacionService,
    private estudiantePerfilService: EstudiantePerfilService,
    private horarioService: HorarioService,
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
      (calificacionesData) => {
        this.calificaciones = calificacionesData.filter(
          (calificacion) => calificacion.estudiante.idEstudiante === this.estudiante?.estudiante?.idEstudiante
        );

        this.horarioService.getAllHorarios().subscribe(
          (horariosData) => {
            this.horarios = horariosData;
            this.calificaciones = this.calificaciones.map(calificacion => {
              const horario = this.horarios.find(h => 
                h.nivelDetalleCurso?.idNivelDetalleCurso === calificacion.curricular.docenteNivelDetalleCurso.nivelDetalleCurso.idNivelDetalleCurso
              );
              return { ...calificacion, horario }; // Añadir el horario a la calificación
            });
          },
          (error) => {
            console.error('Error al obtener horarios:', error);
          }
        );
      },
      (error) => {
        console.error('Error loading grades', error);
      }
    );
  }

  printBoletin(): void {
    if (!this.printBoletinContent || !this.printBoletinContent.nativeElement) {
      console.error('El contenedor del boletín no está disponible. Asegúrate de que hay calificaciones.');
      return;
    }
  
    const printContent = this.printBoletinContent.nativeElement;
  
    html2canvas(printContent, {
      scale: 2,
      useCORS: true,
      logging: true, // Habilitar logs para depuración
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
  
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
  
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      while (heightLeft > 0) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -pageHeight * (imgHeight / pageHeight - heightLeft / pageHeight), imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      pdf.save('Boletin_de_Notas.pdf');
    }).catch(error => {
      console.error('Error al generar el PDF:', error);
    });
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