import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Calificacion } from 'src/app/models/entity/Calificacion.interface';
import { CalificacionService } from 'src/app/services/calificacion/calificacion.service';
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
  selector: 'app-ventana3',
  templateUrl: './ventana3.component.html',
  styleUrls: ['./ventana3.component.scss']
})
export class Ventana3Component implements OnInit {

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
  const apiKey = 'AIzaSyAQm3Xcp6dIoFtmnKXmUEsKOoKlbH91I4c';  
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
      const suggestions = result.candidates[0]?.content?.parts[0]?.text || 'No se recibió respuesta';
      this.openSuggestionsDialog(suggestions);
    },
    error: (error) => {
      console.error('Error al generar sugerencias:', error);
      this.openSuggestionsDialog('Ocurrió un error al generar las sugerencias.');   }
  });
}
 
openSuggestionsDialog(suggestions: string): void {
  this.dialog.open(SuggestionsDialogComponent, {
    data: { suggestions },
  });
}
}























