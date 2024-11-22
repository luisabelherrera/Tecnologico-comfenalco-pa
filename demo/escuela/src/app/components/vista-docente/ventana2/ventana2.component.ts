import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Calificacion } from 'src/app/models/entity/Calificacion.interface';
import { CalificacionService } from 'src/app/services/calificacion/calificacion.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { SuggestionsDialogComponent } from '../../generate-ia/suggestions-dialog/suggestions-dialog.component';

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
  selector: 'app-ventana2',
  templateUrl: './ventana2.component.html',
  styleUrls: ['./ventana2.component.scss']
})
export class Ventana2Component implements OnInit {
  calificaciones: Calificacion[] = [];
  dataSource = new MatTableDataSource<Calificacion>();
  displayedColumns: string[] = ['idCalificacion', 'nota', 'estudiante', 'curricular', 'fechaRegistro', 'actions'];
  aiSuggestions: string | null = null;  

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private calificacionService: CalificacionService,
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog  
  ) {}
  
  ngOnInit(): void {
    this.loadCalificaciones();
  }



  loadCalificaciones(): void {
    this.calificacionService.getCalificaciones().subscribe(
      (data) => {
        this.calificaciones = data;
        this.dataSource.data = this.calificaciones;
        this.dataSource.paginator = this.paginator; 
        this.dataSource.sort = this.sort;  
      },
      (error) => {
        console.error('Error loading grades', error);
      }
    );
  }

  deleteCalificacion(id: number): void {
    if (confirm('Are you sure you want to delete this grade?')) {
      this.calificacionService.deleteCalificacion(id).subscribe(() => {
        this.loadCalificaciones();
      },
      (error) => {
        console.error('Error deleting grade', error);
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
  const apiKey = 'AIzaSyBbDd2224c2Gx82P8ZGb7a51AQ-fJ-mg9A'; // Reemplaza con tu API key
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
  
  // Preparar el prompt
  const prompt = `
    Nota actual: ${grade} (Escala: 0 a 5, mínima para pasar: 2.97).
    Descripción curricular: "${curricularDescription}".
    Proporciona:
    1. Sugerencias cortas y precisas para mejorar el rendimiento en este tema.
    2. Bibliografía relacionada (buscada en internet).
    3. Videos relevantes en YouTube.
    Escribe en español, utiliza íconos claros como 📘, 📚, 📺 y evita el uso de asteriscos (*), guiones (-) o cualquier carácter de lista que no sean íconos. Responde de manera directa y clara.
  `;

  // Llamada HTTP
  this.http.post(url, {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  }).subscribe({
    next: (result: any) => {
      const suggestions = result?.candidates?.[0]?.content?.parts?.[0]?.text || 
                          'No se pudo generar respuesta. Verifica la solicitud.';
      this.openSuggestionsDialog(this.formatResponse(suggestions));
    },
    error: (error) => {
      console.error('Error al generar sugerencias:', error);
      const errorMsg = 'Ocurrió un error al conectar con la API. Por favor, verifica tu conexión o clave API.';
      this.openSuggestionsDialog(errorMsg);
    }
  });
}

private formatResponse(response: string): string {
  return response
    .replace(/\*/g, '') // Elimina cualquier asterisco residual
    .replace(/-/g, '')  // Elimina guiones en caso de que aparezcan
    .replace(/1\./g, '📘') // Cambia "1." por un ícono de libro
    .replace(/2\./g, '📚') // Cambia "2." por un ícono de biblioteca
    .replace(/3\./g, '📺'); // Cambia "3." por un ícono de televisión
}
  



openSuggestionsDialog(content: string): void {
  this.dialog.open(SuggestionsDialogComponent, {
    width: '500px',
    data: { suggestions: content },
  });
}

}























