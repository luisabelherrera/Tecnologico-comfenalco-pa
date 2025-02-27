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
import autoTable from 'jspdf-autotable';

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
    printContent.style.display = 'block'; // Mostrar temporalmente para capturar

    html2canvas(printContent, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: true,
    }).then(canvas => {
      printContent.style.display = 'none'; // Ocultar de nuevo después de capturar
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Añadir la imagen capturada (si es necesario para pruebas)
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

      // Generar el PDF con el formato nuevo usando jspdf-autotable (opcional, pero más preciso)
      this.generatePDFWithTable(pdf);

      pdf.save('Boletin_de_Notas.pdf');
    }).catch(error => {
      console.error('Error al generar el PDF:', error);
      printContent.style.display = 'none'; // Asegurar que se oculte en caso de error
    });
  }

  generatePDFWithTable(pdf: jsPDF): void {
    if (!this.calificaciones.length || !this.estudiante) return;

    // Configurar el PDF con el diseño de la imagen proporcionada
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('BOLETÍN DE NOTAS', 105, 20, { align: 'center' });
    pdf.setFontSize(10);
    pdf.text('Plantilla de boletín de notas de EDIT.org para editar online gratuita', 105, 25, { align: 'center' });

    // Información del estudiante
    pdf.setFontSize(12);
    pdf.text('NOMBRE:', 20, 40);
    pdf.text(`${this.estudiante?.estudiante?.nombres} ${this.estudiante?.estudiante?.apellidos}`, 50, 40);
    pdf.text('AÑO ESCOLAR:', 120, 40);
    pdf.text(this.today.getFullYear().toString(), 160, 40);

    pdf.text('GRADO:', 20, 50);
    pdf.text('Primero', 50, 50); // Ajusta según el modelo, puede venir de calificaciones o estudiante
    pdf.text('PLAZO:', 120, 50);
    pdf.text('Trimestre', 160, 50); // Ajusta según tu lógica (Q1, Q2, Q3)

    pdf.text('PROFESOR:', 20, 60);
    pdf.text('Nombre del Profesor General', 50, 60); // Podrías añadir un campo en UserDto o Calificacion para esto
    pdf.text('FECHAS:', 120, 60);
    pdf.text(`${this.today.toLocaleDateString('es-ES')}`, 160, 60);

    // Tabla de notas (simplificada, asumiendo quimestres Q1, Q2, Q3)
    const tableData = this.calificaciones.map(cal => {
      return [
        cal.curricular.docenteNivelDetalleCurso.nivelDetalleCurso.curso.descripcion,
        cal.nota.toString(), // Q1 (puedes ajustar esto según tu lógica para obtener notas por quimestre)
        cal.nota.toString(), // Q2
        cal.nota.toString()  // Q3
      ];
    });

    autoTable(pdf, {
      startY: 80,
      head: [['TEMA', 'GRADO Q1', 'GRADO Q2', 'GRADO Q3']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [51, 51, 51], textColor: [255, 255, 255], fontSize: 12 },
      bodyStyles: { fillColor: [255, 255, 204], textColor: [0, 0, 0], fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
        3: { cellWidth: 40 }
      },
      margin: { left: 20, right: 20 }
    });

    // Secciones de ausencias, tardanzas, etc. (puedes añadir lógica para estos datos si los tienes)
    const finalY = (pdf as any).lastAutoTable.finalY || 80;
    pdf.setFontSize(12);
    pdf.text('AUSENCIAS:', 20, finalY + 20);
    pdf.text('0', 60, finalY + 20); // Ajusta según datos reales
    pdf.text('TARDÍAS:', 120, finalY + 20);
    pdf.text('0', 160, finalY + 20);

    pdf.text('DESPIDOS ANTICIPADOS:', 20, finalY + 30);
    pdf.text('0', 60, finalY + 30); // Ajusta según datos reales
    pdf.text('SANCIONES:', 120, finalY + 30);
    pdf.text('0', 160, finalY + 30); // Ajusta según datos reales

    // Información de contacto y logo
    pdf.setFontSize(10);
    pdf.text('Dirección: Calle Carmen, 523, 08001 Madrid', 20, finalY + 50);
    pdf.text('Teléfono: 62278919', 20, finalY + 55);

    // Añadir un logo (puedes usar una imagen local o externa)
    const logoImg = new Image();
    logoImg.src = 'assets/logo.png'; // Ajusta la ruta de tu logo
    logoImg.onload = () => {
      pdf.addImage(logoImg, 'PNG', 160, finalY + 40, 30, 15); // Posición y tamaño del logo
      pdf.save('Boletin_de_Notas.pdf');
    };
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